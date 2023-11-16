document.addEventListener('DOMContentLoaded', function() {
	var videoContainer = document.getElementById('video-container');
	var statusMessage = document.getElementById('status-message');
  
	//simulacija stanja live prijenosa (true ili false)
	var isLive = true;
  
	if (isLive) {
		//ako je live, prikazi video prijenos
		videoContainer.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/jfKfPfyJRdk" frameborder="0" allowfullscreen></iframe>';
	} else {
		//ako nije live, prikazi poruku
		statusMessage.innerText = 'Trenutno nema aktivne konferencije.';
	}
  });
  