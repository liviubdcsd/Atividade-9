async function buscar() {
  const cep = document.getElementById("cep").value;
  const climaEl = document.getElementById("clima-container");

  try {
    const resEndereco = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
    const dadosEndereco = await resEndereco.json();

    const { city, state, address, lat, lng } = dadosEndereco;

    const resClima = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=auto`
    );
    const dadosClima = await resClima.json();

    const climaAtual = dadosClima.current_weather;
    const previsaoDias = dadosClima.daily;

    const now = new Date();
    const dataFormatada = now.toLocaleDateString("pt-BR", {
      weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    // Ícones de clima
    const icones = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️",
      61: "🌧️", 63: "🌦️", 65: "🌧️", 71: "❄️", 80: "🌦️", 95: "⛈️"
    };

    let html = `
      <div class="clima-atual-card">
        <div class="clima-local">
          <h2>${city}, ${state}</h2>
          <p>${address}</p>
          <p class="atualizado">Atualizado - ${dataFormatada}</p>
        </div>
        <div class="clima-info">
          <div class="clima-temperatura">
            <div class="icone">${icones[climaAtual.weathercode] || "☁️"}</div>
            <div class="temp">${climaAtual.temperature}°C</div>
          </div>
          <div class="clima-detalhes">
            <p>Vento: ${climaAtual.windspeed} km/h</p>
            <p>Umidade: --%</p>
          </div>
        </div>
        <div class="clima-condicao">
          <p>Condição atual</p>
        </div>
      </div>
      <h2>Previsão para os próximos dias</h2>
      <div class="previsao-container">`;

    for (let i = 0; i < previsaoDias.time.length; i++) {
      const data = new Date(previsaoDias.time[i]);
      const dia = data.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" });
      const icone = icones[previsaoDias.weathercode[i]] || "🌈";
      html += `
        <div class="card-dia">
          <strong>${dia}</strong>
          <div class="icone-clima">${icone}</div>
          <p class="temp-max">${previsaoDias.temperature_2m_max[i]}°C</p>
          <p class="temp-min">${previsaoDias.temperature_2m_min[i]}°C</p>
        </div>
      `;
    }

    html += `</div>`;
    climaEl.innerHTML = html;
  } catch (error) {
    climaEl.innerHTML = "<p>Erro ao buscar informações. Verifique o CEP.</p>";
  }
}
