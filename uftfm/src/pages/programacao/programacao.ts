import { Component, EventEmitter } from '@angular/core';
import { IonicPage } from 'ionic-angular';

//Importação dos componentes para recuperação de Json das informações
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-programacao',
  templateUrl: 'programacao.html',
})
export class ProgramacaoPage {

  items;
  resultEmitter = new EventEmitter<Object>();
  resultadoProgramacao: any;

  constructor(public http: Http) {
    //Recuperar Json
    this.inicializarTela();
    this.ouvinteJsonProgramacao();
  }

  // ionViewDidLoad() {}

  //Recuperar Programação
  inicializarTela() {
    //Acessar URL e recuperar o JSON
    var date = new Date;
    var dia = date.getUTCDate();
    var mes = date.getUTCMonth() + 1;
    var ano = date.getUTCFullYear();

    var dataInicio = ano + "-" + mes + "-" + dia;
    var dataFinal = ano + "-" + mes + "-" + dia;

    var url = " https://sistemas.uft.edu.br/agenda/fullcalendar?o=1&a[]=34&start=" + dataInicio + "&end=" + dataFinal;

    this.http.get(url).subscribe(data => {
      var jsonobject = data.json();
      this.resultadoProgramacao = jsonobject;
      this.resultEmitter.emit(jsonobject);
    });
    // this.exibirProgramacao();
  }

  //Inscrição em Evento, ou seja, quando a informação chegar
  ouvinteJsonProgramacao() {
    this.resultEmitter.subscribe(
      status => {
        if (status) {
          this.items = status;
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].imagem != null) {
              this.items[i].imagem = "https://sistemas.uft.edu.br/agenda/arquivos/" + this.items[i].imagem;
            }
            if (this.items[i].descricao != null) {
              this.items[i].descricao = this.decodeHtmlToText(this.items[i].descricao);
            }
          }
          this.ordenarPorHorario();
        }
      }
    );
  }

  //Decodificando HTML do texto
  decodeHtmlToText(string) {
    var parser = new DOMParser;
    var dom = parser.parseFromString('<!doctype html><body>' + string, 'text/html');
    var decodedString = dom.body.textContent;
    return decodedString;
  }

  //Recuperar Programação
  exibirProgramacao() {
    var date = new Date;
    var dia = date.getUTCDate();
    var mes = date.getUTCMonth() + 1;
    var ano = date.getUTCFullYear();

    var dataInicio = ano + "-" + mes + "-" + dia;
    var dataFinal = ano + "-" + mes + "-" + dia;

    var url = " https://sistemas.uft.edu.br/agenda/fullcalendar?o=1&a[]=34&start=" + dataInicio + "&end=" + dataFinal;

    this.http.get(url).subscribe(data => {
      var jsonobject = data.json();
      this.resultadoProgramacao = jsonobject;
      this.resultEmitter.emit(jsonobject);
    });
  }

  //Método auxiliar de ordenação
  sortFunction(a, b) {
    var dateA = new Date(a.start).getTime();
    var dateB = new Date(b.start).getTime();
    return dateA > dateB ? 1 : -1;
  }

  //Ordenando a programação por horário
  ordenarPorHorario() {
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 0; j < this.items.length - 1; j++) {
        if (this.sortFunction(this.items[j], this.items[j + 1]) == 1) {
          let swap = this.items[j];
          this.items[j] = this.items[j + 1];
          this.items[j + 1] = swap;
        }
      }
    }
  }
}
