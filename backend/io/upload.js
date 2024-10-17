import { v2 as cloudinary } from 'cloudinary';

//setup the cloud
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function createSignature(options) {
    //timestamp of the signature
    const timestamp = Math.round((new Date).getTime() / 1000);

    //request signature from cloudinary
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        ...options
    }, process.env.CLOUDINARY_API_SECRET);

    return {
        signature,
        timestamp,
        ...options
    };
}

//create siganture for a chat media
async function createChatSignature(roomId, messageId, imageId, mimeType) {
    const options = {
        upload_preset: getUploadPreset(mimeType),
        public_id: imageId,
        folder: `/chat-app/${roomId}/${messageId}`,
    }

    const signature = await createSignature(options);

    return signature;
}

//select upload preset based on mimetype
function getUploadPreset(mimeType) {
    //the gif needs a separate preset because the images are converted to avif, and the gif will not play when resized in avif format
    if (mimeType === "image/gif")
        return "message_gif";
    if (mimeType.startsWith("image"))
        return "message_image";
    if (mimeType.startsWith("video"))
        return "message_video";
    return "message_raw";
}

export { createChatSignature };
