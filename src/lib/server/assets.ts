import supabase from './supabase';

export const uploadAssets = async (assets: File[]) => {
	try {
		let uploadedAssets: string[] = [];

		for (const file of assets) {
			if (file.type.startsWith('image/')) {
				const filePath = `${Date.now()}-${file.name}`;
				const { data, error } = await supabase.storage.from('assets').upload(filePath, file);

				if (error) {
					console.error('Error uploading file:', error);
					return null;
				} else {
					const uploadedFile = supabase.storage.from('assets').getPublicUrl(data.path);
					uploadedAssets.push(uploadedFile.data.publicUrl);
				}
			}
		}

		return uploadedAssets;
	} catch (error) {
		console.log('Error uploading assets:', error);
		return null;
	}
};
