import { Component, EventEmitter } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController } from 'ionic-angular';

//Importes de Paginas
import { ProgramacaoPage } from '../programacao/programacao'
import { SobreFabricaPage } from '../sobre-fabrica/sobre-fabrica'
import { SobreRadioPage } from '../sobre-radio/sobre-radio'

//Importação dos Componentes de Exibição do Player no Espaço de Notificações
import { MusicControls } from '@ionic-native/music-controls';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //Variaveis de Instancia
  imgAcao: String;
  imgInfo: String;
  imgShare: String;
  imgPrograma: String;
  imgCalendar: String;
  nomePrograma: String;
  tap;
  estado: boolean;
  url: string;

  //Variaveis de Execução de Audio
  promise: any;
  playPromisse: any;
  stream: any;
  streamAux: any;

  //Variaveis de Eventos
  emitirAcaoPlay = new EventEmitter<boolean>();
  emitirAcaoPause = new EventEmitter<boolean>();
  emitirAcaoDestroy = new EventEmitter<boolean>();

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,  
    public musicControls: MusicControls) {

    //Imagens e Label...
    this.instanciarVariaveis();


    //Inscrever os métodos que estarão ouvindo as alterações
    this.ouvinteDeAlteracoes();  
  }

  //URL de conexão com a rádio
  instanciarVariaveis() {
    this.url = "http://caqui.uft.edu.br:8000/uftfm";
    this.estado = false;
    this.imgAcao = "assets/img/play-button.svg";
    this.imgShare = "assets/img/share.svg";
    this.imgCalendar = "assets/img/calendar.svg";
    this.imgInfo = "assets/img/info.svg";
    this.imgPrograma = "assets/img/logo.jpg"
    this.nomePrograma = "UFTFM 96,9";
    this.tap = 0;
  }

  //Abrir Informações da Radio
  exibirInformacao() {
    this.abrirModal(SobreRadioPage);
  }

  //Abrir Pagina Modal
  abrirModal(page) {
    this.modalCtrl.create(page, null, { cssClass: 'inset-modal' }).present();
  }

  //Ir para pagina de programação
  exibirProgramacao() {
    this.navCtrl.push(ProgramacaoPage);
  }

  //Depois de 10 toques, abrir info sobre a fabrica
  tapEvent(e) {
    this.tap++
    if (this.tap == 10) {
      this.abrirModal(SobreFabricaPage)
      this.tap = 0;
    }
  }

  //Exibir algum alerta
  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  //Controle de Tocador de Rádio: Play
  play() {
    //Criar a capa do play para notificações de audio
    this.instanciaDeCapa();

    //Criar loading para receber o audio
    let loader = this.loadingCtrl.create({
      content: "Por favor, espere...",
    });

    loader.present();

    //Liberar Execução de Stream
    if (this.playPromisse == undefined) {
      this.stream = new Audio(this.url);
      //this.stream
      this.playPromisse = this.stream.play();
      this.promise = new Promise((resolve, reject) => {
        this.stream.addEventListener('playing', () => {
          //Altera o estado para "Tocando"
          this.imgAcao = "assets/img/pause.svg";
          this.estado = true;
          loader.dismiss();
          resolve(true);
        });
        this.stream.addEventListener('error', () => {
          console.log("Error");
          reject(false);
        });
      });

      //Aletrar Animação do Tocador
      this.musicControls.updateIsPlaying(true);
      return this.promise;
    }
  }

  //Controle de Tocador de Rádio: Pause
  pause() {
    //Pausar Execução de Stram
    if (this.playPromisse != undefined) {
      this.playPromisse.then(_ => {
        this.playPromisse = this.stream.pause();
        //Cancelar dowload de straming
        this.stream.src = '';
        //Alterar Estado
        this.estado = false;
        this.imgAcao = "assets/img/play-button.svg";
      })
        .catch(error => {
          console.log("Error");
        });
    }
    //Aletrar Animação do Tocador
    this.musicControls.updateIsPlaying(false);
  }

  //Alterar Estado: Play -> Pause ou Pause -> Play
  alterarEstado() {
    if (this.estado) this.pause();
    else {
      this.play();
    }
  }

  //Destruir Player das Notificações
  destroy() {
    this.pause();
    this.musicControls.destroy();
  }

  //Inscrição em ação de eventos
  ouvinteDeAlteracoes() {
    this.musicControls.subscribe().subscribe(action => {
      if (action) {

        const message = JSON.parse(action).message;
        switch (message) {
          case 'music-controls-next':
            break;
          case 'music-controls-previous':
            break;
          case 'music-controls-pause':
            this.emitirAcaoPause.emit(true);
            break;
          case 'music-controls-play':
            this.emitirAcaoPlay.emit(true);
            break;
          case 'music-controls-destroy':
            this.emitirAcaoDestroy.emit(true);

            break;
          default:
            break;
        }
      }

    });

    // Ativar Observação
    this.musicControls.listen(); 

    this.emitirAcaoPlay.subscribe(
      status => {
        if (status) {
          this.play()
        }
      }
    );
    this.emitirAcaoPause.subscribe(
      status => {
        if (status) {
          this.pause()
        }
      }
    );
    this.emitirAcaoDestroy.subscribe(
      status => {
        if (status) {
          this.destroy()
        }
      }
    );
  }

  //Modelo da Capa de áudio da barra de notificações
  instanciaDeCapa() {
    this.musicControls.create({
      track: 'Rádio UFT 96,9',        // optional, default : ''
      artist: 'Ao vivo',                       // optional, default : ''
      cover: 'assets/img/logo.jpg',      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,                         // optional, default : true
      dismissable: true,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: false,      // show previous button, optional, default: true
      hasNext: false,      // show next button, optional, default: true
      hasClose: true,       // show close button, optional, default: false

      // iOS only, optional
      album: 'Absolution',     // optional, default: ''
      duration: 60, // optional, default: 0
      elapsed: 10, // optional, default: 0
      hasSkipForward: true,  // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0

      ticker: 'Now playing "Time is Running Out"'
    });
  }

}


