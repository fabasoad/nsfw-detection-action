import fs from "fs";

const url = 'https://api.cloudmersive.com/image/nsfw/classify';

try {
  const formData = new FormData();
  formData.append('imageFile', fs.createReadStream('91cDPlxcRiL._SL1500_.jpg'));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': process.env.CLOUDMERSIVE_API_KEY
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log('Success:', responseData);
} catch (error) {
  console.error('Error calling API:', error);
}
