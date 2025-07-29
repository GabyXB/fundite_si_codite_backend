import OpenAI from 'openai';
import dotenv from 'dotenv';
import Haina from '../models/Haina.js';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import { s3Config } from '../config/database.js';
import sharp from 'sharp';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funcție pentru a converti URL-ul imaginii în base64 (versiunea actuală funcțională)
async function encodeImageFromUrl(imageUrl) {
  try {
    console.log('Încerc să convertesc imaginea:', imageUrl);
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    
    console.log('Imagine convertită cu succes în base64, dimensiune:', base64.length);
    return base64;
  } catch (error) {
    console.error('Eroare la convertirea imaginii în base64:', error);
    console.error('URL imagine:', imageUrl);
    throw new Error(`Nu s-a putut încărca imaginea: ${error.message}`);
  }
}

// Funcție pentru viitoarele optimizări - redimensionarea imaginilor pentru reducerea costurilor
async function encodeImageFromUrlOptimized(imageUrl, maxWidth = 512, maxHeight = 512, quality = 80) {
  try {
    console.log(`Încerc să convertesc și redimensionez imaginea la ${maxWidth}x${maxHeight}, calitate ${quality}%:`, imageUrl);
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    
    // Redimensionăm imaginea pentru a reduce tokenii de input
    const resizedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: quality })
      .toBuffer();
    
    const base64 = resizedBuffer.toString('base64');
    
    console.log(`Imagine redimensionată cu succes, dimensiune base64:`, base64.length);
    return base64;
  } catch (error) {
    console.error('Eroare la convertirea și redimensionarea imaginii:', error);
    console.error('URL imagine:', imageUrl);
    throw new Error(`Nu s-a putut încărca imaginea: ${error.message}`);
  }
}

/**
 * Generează preview cu animal îmbrăcat în haină bazat pe poza reală
 */
export const generatePetClothingPreview = async (req, res) => {
  console.log('=== GENERATE PET CLOTHING PREVIEW STARTED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const { 
    petImageUrl, 
    hainaId,
    numeAnimal,
    imageQuality = 'low', // 'low', 'medium', 'high'
    inputImageSize = 'medium', // 'small', 'medium', 'large'
    imageSize = '1024x1024' // '1024x1024', '1024x1536', '1536x1024'
  } = req.body;

  if (!petImageUrl || !hainaId) {
    console.log('ERROR: Lipsește petImageUrl sau hainaId');
    console.log('petImageUrl:', petImageUrl);
    console.log('hainaId:', hainaId);
    return res.status(400).json({ 
      error: 'Câmpurile obligatorii: petImageUrl, hainaId' 
    });
  }

  try {
    console.log('Căutăm haina în baza de date cu ID:', hainaId);
    // Găsim haina din baza de date
    const haina = await Haina.findByPk(hainaId);
    if (!haina) {
      return res.status(404).json({ 
        error: 'Haina nu a fost găsită' 
      });
    }

    // Verificăm că avem ambele imagini
    if (!haina.imagine) {
      return res.status(400).json({ 
        error: 'Haina nu are o imagine asociată' 
      });
    }



    // Configurări pentru optimizări de costuri - ACTIVATE
    
    // Configurăm dimensiunile de input în funcție de opțiunea selectată
    let inputWidth, inputHeight, inputQuality;
    switch (inputImageSize) {
      case 'small':
        inputWidth = 256;
        inputHeight = 256;
        inputQuality = 70;
        break;
      case 'large':
        inputWidth = 768;
        inputHeight = 768;
        inputQuality = 90;
        break;
      default: // medium
        inputWidth = 512;
        inputHeight = 512;
        inputQuality = 80;
    }

    // Configurăm calitatea imaginii generate
    let generationQuality, estimatedCost;
    switch (imageQuality) {
      case 'low':
        generationQuality = 'low';
        estimatedCost = 0.0001;
        break;
      case 'high':
        generationQuality = 'high';
        estimatedCost = 0.0005;
        break;
      default: // medium
        generationQuality = 'medium';
        estimatedCost = 0.0003;
    }

    // Convertim imaginile în base64 cu optimizări pentru reducerea costurilor
    console.log(`Convertind imagini în base64 cu dimensiuni ${inputWidth}x${inputHeight}, calitate ${inputQuality}%...`);
    console.log('URL poza animal:', petImageUrl);
    console.log('URL imagine haină:', haina.imagine);
    
    const petImageBase64 = await encodeImageFromUrlOptimized(petImageUrl, inputWidth, inputHeight, inputQuality);
    const clothingImageBase64 = await encodeImageFromUrlOptimized(haina.imagine, inputWidth, inputHeight, inputQuality);
    
    console.log('Ambele imagini convertite cu succes');

    // Prompt scurt pentru costuri reduse
    const prompt = `Pet from image 1 wearing clothing from image 2. Keep pet's appearance, fit clothing naturally. Professional photo style.`;

    console.log(`Generând imagine cu GPT-4.1, calitate: ${generationQuality}, dimensiune: ${imageSize}...`);

    // Generăm imaginea cu GPT-4.1
    console.log('Trimit cererea la GPT-4.1...');
    
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${petImageBase64}`,
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${clothingImageBase64}`,
            },
          ],
        },
      ],
      tools: [{ 
        type: "image_generation",
        image_generation: {
          quality: generationQuality,
          size: imageSize
        }
      }]
    });

    console.log('Răspuns primit de la GPT-4.1');
    console.log('Output length:', response.output.length);

    // Extragem imaginea generată
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    console.log('Image data length:', imageData.length);

    if (imageData.length === 0) {
      console.error('Nu s-a găsit nicio imagine în răspuns');
      console.error('Response output:', JSON.stringify(response.output, null, 2));
      throw new Error('Nu s-a generat nicio imagine');
    }

    const generatedImageBase64 = imageData[0];
    
    console.log('Imagine generată cu succes, dimensiune base64:', generatedImageBase64.length);
    
    // Prima dată returnăm imaginea ca data URL pentru afișare imediată
    const immediateImageUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    // Convertim base64 în buffer pentru S3
    const imageBuffer = Buffer.from(generatedImageBase64, 'base64');
    
    // Generăm nume unic pentru imagine
    const timestamp = Date.now();
    const fileName = `generated-${hainaId}-${timestamp}.png`;
    
    console.log('Încărcând imaginea în S3...');
    
    // Încărcăm imaginea în S3 (fără ACL, ca în upload-ul existent)
    const uploadParams = {
      Bucket: s3Config.bucketName,
      Key: `images/${fileName}`,
      Body: imageBuffer,
      ContentType: 'image/png'
    };
    
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    const s3ImageUrl = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/images/${fileName}`;
    
    console.log('Imagine încărcată în S3:', s3ImageUrl);

    // Salvăm URL-ul S3 în câmpul imagine_gen al hainei
    haina.imagine_gen = s3ImageUrl;
    await haina.save();

    res.status(200).json({
      success: true,
      imageUrl: immediateImageUrl, // Returnăm data URL pentru afișare imediată
      s3ImageUrl: s3ImageUrl, // URL-ul S3 pentru salvare
      prompt: prompt,
      cost: estimatedCost, // Cost calculat în funcție de setările de calitate și dimensiune
      settings: {
        imageQuality: generationQuality,
        imageSize: imageSize,
        inputImageSize: inputImageSize,
        inputDimensions: `${inputWidth}x${inputHeight}`,
        inputQuality: inputQuality,
        note: "Optimizările de cost sunt activate - redimensionarea imaginilor de input și calitatea imaginii generate"
      },
      haina: {
        id: haina.id,
        nume: haina.nume,
        material: haina.material,
        marime: haina.marime,
        imagine: haina.imagine,
        imagine_gen: s3ImageUrl
      },
      previewData: {
        petImageUrl,
        numeAnimal,
        hainaId
      }
    });

  } catch (error) {
    console.error('Eroare la generarea preview-ului personalizat:', error);
    res.status(500).json({ 
      error: 'Eroare la generarea preview-ului personalizat',
      details: error.message 
    });
  }
};

 