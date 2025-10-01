async function obtenerRepositorios() {
  const savedToken = sessionStorage.getItem("githubToken") || "";
  const savedUsername = sessionStorage.getItem("githubUsername") || "";

  const url = `https://api.github.com/users/${savedUsername}/repos`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const repos = await response.json(); // Seleccionar contendores

    const contenedor = document.getElementById("lista-proyectos");
    const mensajeVacio = document.querySelector(".mensaje-vacio");

    contenedor.innerHTML = ""; // mensaje no hay repos

    if (repos.length === 0) {
      if (mensajeVacio) {
        contenedor.appendChild(mensajeVacio);
      }
      return;
    } // flujo de si hay repos

    if (mensajeVacio) {
      mensajeVacio.style.display = "none";
    }

    repos.forEach(async (repo) => {
      const langUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`;

      try {
        const langResponse = await fetch(langUrl, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        if (!langResponse.ok) {
          throw new Error(`Error lenguajes: ${langResponse.status}`);
        }

        const languages = await langResponse.json();

        const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
        const languagePercentages = {};
        for (const [lang, bytes] of Object.entries(languages)) {
          languagePercentages[lang] =
            ((bytes / totalBytes) * 100).toFixed(2) + "%";
        }

        console.log(`Repo: ${repo.name}`, languagePercentages);

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-proyecto";
        let estado = "Pendiente";
        if (
          repo.description &&
          repo.description.toUpperCase().includes("COMPLETADO")
        ) {
          estado = "Terminado ✅";
        } else if (
          repo.description &&
          repo.description.toUpperCase().includes("PROGRESO")
        ) {
          estado = "En progreso 🚧";
        }
        const fecha = new Date(repo.created_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        tarjeta.innerHTML = `
            <h3>${repo.name}</h3>
            <p><strong>Descripción:</strong> ${
              repo.description || "Sin descripción"
            }</p>
            <p><strong>Estado:</strong> ${estado}</p>
            <p><strong>Creado:</strong> ${fecha}</p>
            <p><strong>Estado:</strong> ${
              repo.private ? "Privado" : "Público"
            }</p>
            <p><strong>⭐ Estrellas:</strong> ${repo.stargazers_count}</p>
        <div>
            <a href="${
              repo.html_url
            }" target="_blank" class="btn-ver">🌐 Ver en GitHub</a>
            ${
              repo.homepage
                ? `<a href="${repo.homepage}" target="_blank" class="btn-ver">🚀 Visitar sitio</a>`
                : ""
            }
        </div>
            <p><strong>Lenguajes:</strong> ${
              Object.entries(languagePercentages)
                .map(([lang, perc]) => `${lang} (${perc})`)
                .join(", ") || "Sin avances para recopilar datos"
            } </p>
 `;

        contenedor.appendChild(tarjeta);
      } catch (error) {
        console.error("Error obteniendo lenguajes:", error);
      }
    });

    const totalEstrellas = repos.reduce(
      (suma, repo) => suma + repo.stargazers_count,
      0
    );

    const promedioEstrellas =
      repos.length > 0 ? (totalEstrellas / repos.length).toFixed(1) : 0;

    document.getElementById("total-proyectos").textContent = repos.length;
    document.getElementById("porcentaje-completado").textContent = "N/A";
    document.getElementById("promedio-calificacion").textContent =
      promedioEstrellas;
  } catch (error) {
    console.error("Error al obtener o mostrar repositorios:", error);

    const contenedor = document.getElementById("lista-proyectos");
    contenedor.innerHTML = `
 <div class="error">
 <p>⚠️ No se pudieron cargar los proyectos. Verifica tu conexión o token.</p>
 <p>${error.message}</p>
</div>
 `;
  }
}
// Llamo la función cuando el DOM esté listo

window.obtenerRepositorios = obtenerRepositorios;

//funcion para buscar
document.addEventListener("keyup", (e) => {
  if (e.target.matches("#buscador")) {
    document.querySelectorAll(".tarjeta-proyecto").forEach((repo) => {
      repo.textContent.toLowerCase().includes(e.target.value)
        ? repo.classList.remove("filtro")
        : repo.classList.add("filtro");
    });
  }
});
