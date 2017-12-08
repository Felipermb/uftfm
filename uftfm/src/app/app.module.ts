import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//Importes de Paginas
import { HomePage } from '../pages/home/home';
import { ProgramacaoPage } from '../pages/programacao/programacao'
import { SobreFabricaPage } from '../pages/sobre-fabrica/sobre-fabrica'
import { SobreRadioPage } from '../pages/sobre-radio/sobre-radio'


//Importes de Modulos das Paginas
import { ProgramacaoPageModule } from '../pages/programacao/programacao.module';
import { SobreFabricaPageModule } from '../pages/sobre-fabrica/sobre-fabrica.module';
import { SobreRadioPageModule } from '../pages/sobre-radio/sobre-radio.module';

//Importe de Modulos
import { HttpModule } from '@angular/http';

//Importação dos Componentes de Exibição do Player no Espaço de Notificações
import { MusicControls } from '@ionic-native/music-controls';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // ProgramacaoPage,
    // SobreFabricaPage,
    // SobreRadioPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    ProgramacaoPageModule,
    SobreFabricaPageModule,
    SobreRadioPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProgramacaoPage,
    SobreFabricaPage,
    SobreRadioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MusicControls
  ]
})
export class AppModule {}
