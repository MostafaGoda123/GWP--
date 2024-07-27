let apiURL = 'https://mp3quran.net/api/v3'
// let reciters = 'reciters'
let language = 'ar'

async function getReciters() {
   let res = await fetch(`${apiURL}/reciters?language=${language}`)
   let data = await res.json()
   let chooseReciter = document.getElementById("chooseReciter")
   chooseReciter.innerHTML = `<option>اختر قارئ</option>`
   data.reciters.map(ele => {
      chooseReciter.innerHTML += `<option value="${ele.id}">${ele.name}</option>`
   })
   chooseReciter.addEventListener("change" , e => getMoshafs(e.target.value))
}
async function getMoshafs(id) {
   let res = await fetch(`${apiURL}/reciters?language=${language}&reciter=${id}`)
   let data = await res.json()
   let moshafs = data.reciters[0].moshaf
   let chooseMoshafs = document.getElementById("chooseMoshafs")
   chooseMoshafs.innerHTML = `<option>اختر روايه</option>`
   moshafs.map(ele => {
      chooseMoshafs.innerHTML += `<option value="${ele.id}">${ele.name}</option>`
   })
   chooseMoshafs.addEventListener("change" , (e) => getSurah(moshafs , id))
}
async function getSurah(moshafs , id) {
   let chooseSurah = document.getElementById("chooseSurah")
   chooseSurah.innerHTML = `<option>اختر سوره</option>`
   let moshaf = moshafs.filter(e => e.id == id)
   let res = await fetch(`${apiURL}/suwar`)
   let data = await res.json()
   data.suwar.map(suw=>{
      moshaf[0].surah_list.split(",").map(mos => {
         let padSurah = mos.padStart(3,"0")
         if ( mos == suw.id ) {
            chooseSurah.innerHTML += `<option value="${moshaf[0].server}${padSurah}.mp3">${suw.name}</option>`
         }
      })
   })
   chooseSurah.addEventListener("change" , (e) => {
      let selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
      let audioPlayer = document.getElementById("audioPlayer")
      audioPlayer.src = selectedSurah.value
      audioPlayer.play()
   })
}

getReciters()


function playLive(channel) {
   if(Hls.isSupported()) {
      var video = document.getElementById('liveVideo');
      var hls = new Hls();
      hls.loadSource(`${channel}`);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
         video.play();
      });
      }
}
