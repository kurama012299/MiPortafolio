function toggleModoOscuro() {
    const body = document.body;
    const boton = document.getElementById('btn-modo');
    
    body.classList.toggle('modo-oscuro');
    
    if (body.classList.contains('modo-oscuro')) {
        boton.textContent = '☀️ Modo Claro';
        localStorage.setItem('modoOscuro', 'activado');
    } else {
        boton.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('modoOscuro', 'desactivado');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modoGuardado = localStorage.getItem('modoOscuro');
    const boton = document.getElementById('btn-modo');
    
    if (modoGuardado === 'activado') {
        document.body.classList.add('modo-oscuro');
        boton.textContent = '☀️ Modo Claro';
    }
    
    boton.addEventListener('click', toggleModoOscuro);
});
//eventos para abrir y cerrar el modal
window.addEventListener('load', () => {
  const modal = document.getElementById('modal');
  const modalConfig = document.getElementById('modal-config');
  let savedToken = sessionStorage.getItem('githubToken');
  let savedUsername = sessionStorage.getItem('githubUsername') ;
  console.log(savedUsername);
  if(savedToken===null && savedUsername===null){
      modal.style.display = 'flex';
  }
  const openBtn = document.getElementById('jumpto-page');
  openBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalConfig.style.display = 'flex';
  });
  const closeBtn = document.getElementById('closeModalBtn');
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const buttonModal = document.getElementById('openModalBtn');
  const confirmBtn = document.getElementById('confirm-button');
  const tokenInput = document.getElementById('token-input');
  const usernameInput = document.getElementById('user-input');
  //cargar datos si existen
  const savedToken = sessionStorage.getItem('githubToken') || '';
  const savedUsername = sessionStorage.getItem('githubUsername') || '';
  
  tokenInput.value = savedToken;
  usernameInput.value = savedUsername;

     if (typeof window.obtenerRepositorios === "function") {
     window.obtenerRepositorios();
   }

  const modalConfig = document.getElementById('modal-config');
  const closeBtnConfig = document.getElementById('closeModalBtn-config');

  if (!buttonModal || !modalConfig || !closeBtnConfig) {
    console.warn('Algunos elementos del DOM no se encontraron');
    return;
  }

  buttonModal.addEventListener('click', () => {
    modalConfig.style.display = 'flex';
  });

  closeBtnConfig.addEventListener('click', () => {
    modalConfig.style.display = 'none';
  });

  if (confirmBtn && tokenInput && usernameInput) {
    confirmBtn.addEventListener('click', () => {
      const token = tokenInput.value.trim();
      const username = usernameInput.value.trim();

      // validación que exista
      if (!token || !username) {
        alert('⚠️ Por favor, ingresa tanto el token como el nombre de usuario.');
        return;
      }

      sessionStorage.setItem('githubToken', token);
      sessionStorage.setItem('githubUsername', username);

      alert('✅ Configuración guardada correctamente.');
      modalConfig.style.display = 'none';

       if (typeof window.obtenerRepositorios === "function") {
     window.obtenerRepositorios();
   }


    });
  }
});



