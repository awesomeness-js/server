export default function updateProfileImage(image){

	$(`.awesomeness-app-pwa-profile-pic`).css({
		'background-image': `url(${image})`
	});

}