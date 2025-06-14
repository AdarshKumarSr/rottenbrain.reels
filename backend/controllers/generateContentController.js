const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const { ContentModel } = require('../models/ContentModel');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const BUCKET_NAME = 'rotten-brains-reel-audios';

const langs = {
  "hindi" : [ "hi-IN", "hi-IN-Wavenet-A", "MALE" ],
  "gujarati" : [ "gu-IN", "gu-IN-Standard-A", "FEMALE" ],
  "english" : ['en-US', 'en-US-Neural2-D', "MALE"]
}

async function generateEducationalContent(req, res) {
  const { userId, topic, language } = req.body;
  if (!topic || !userId) return res.status(400).json({ error: 'Missing topic or userId' });

  try {
    // 1. Generate script using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Make a fun, ~1-minute Gen Z-style educational script about: ${topic}` }] }],
      systemInstruction: `You are a fun Gen Z teacher. Only return the actual script and no * or ** . script must only be in ${language} no other language`,
    });

    function cleanGeminiScript(text) {
  return text
    .replace(/\*{1,2}.*?\*{1,2}/g, '')                         // Remove *italic* and **bold**
    .replace(/\(.*?(music|sound|beat|pause|fade).*?\)/gi, '')  // Remove stage directions
    .replace(/\n{2,}/g, '\n')                                  // Collapse multiple newlines
    .replace(/^\s+|\s+$/g, '')                                 // Trim leading/trailing
    .replace(/ +(?= )/g, '')                                   // Extra spaces
    .trim();
}

    const response = await result.response;
    const scriptText = response.text()
      .replace(/^(here(’s|'s)?[^:\n]*[:\n])?/i, '') // Improved regex to remove common preambles
      .trim()
     const cleanScript = cleanGeminiScript(scriptText);
    

    console.log('🎤 Gemini script generated');

    // 2. Convert script to speech (MP3)
    const ttsRequest = {
      input: { text: cleanScript },
      voice: {
        languageCode: langs[language][0],
        name: langs[language][1],
        ssmlGender: langs[language][2],
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.5,
        pitch: 2.0,
      },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    console.log('🔊 TTS synthesis done');

    // 3. Write MP3 to temp file
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName = `tts-${Date.now()}.mp3`;
    const tempFilePath = path.join(tempDir, fileName);
    await fs.promises.writeFile(tempFilePath, ttsResponse.audioContent, 'binary');
    console.log('💾 MP3 saved locally');

    // 4. Upload to GCS
    await storage.bucket(BUCKET_NAME).upload(tempFilePath, {
      destination: `tts/${userId}/${fileName}`,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/tts/${userId}/${fileName}`;
    console.log('☁️ File uploaded to GCS:', publicUrl);

    // 5. Store in MongoDB
    const contentDoc = await ContentModel.create({
      userId,
      topic,
      script: cleanScript,
      audioUrl: publicUrl,
      gcsPath: `tts/${userId}/${fileName}`,
      wordCount: cleanScript.split(/\s+/).length,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    console.log('📦 MongoDB entry created:', contentDoc._id);

    // 6. Cleanup temp file
    await fs.promises.unlink(tempFilePath).catch(() => {});
    console.log('🧹 Temp file deleted');

    // 7. Response
    res.status(200).json({
      message: '✅ Content generated successfully',
      script: cleanScript,
      audioUrl: publicUrl,
      gcsPath: `tts/${userId}/${fileName}`,
      id: contentDoc._id,
      createdAt: contentDoc.createdAt,
    });

  } catch (err) {
    console.error('❌ Error in generation pipeline:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

module.exports = { generateEducationalContent };
