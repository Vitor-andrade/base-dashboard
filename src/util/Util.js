import React, {useRef, useEffect} from 'react';
import moment from 'moment';

export function extractContrastColor(color){
    var c = (color || "#FFFFFF").substring(1);
    var rgb = parseInt(c, 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >>  8) & 0xff;
    var b = (rgb >>  0) & 0xff;

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma > (140) ? '#3a3a3a' : '#FAFAFA'
}

export const getFiscalNoteStatus = (fiscalNote) => {
    return fiscalNote.transmitenota_key 
    ? fiscalNote.transmitenota_status
    : fiscalNote.gladium_idFiscalNota 
        ? {
            "1": "ENVIADA",
            "2": "APROVADA",
            "3": "CANCELADA",
            "5": "REPROVADA",
            "8": "EM PROCESSAMENTO",
            "9": "SEM RETORNO DA SEFAZ",
        }[`${fiscalNote.gladium_situacao}`]
        : "DESCONHECIDO"
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

export const typeRecurrences = [
    {id: 0, key: 'none', label: '', title: 'Não recorrente'},
    {id: 1, moment_type: 'days', key: 'daily', label: 'dia(s)', title: 'Diário'},
    {id: 2, moment_type: 'weeks', key: 'weekly', label: 'semana(s)', title: 'Semanal'},
    {id: 3, moment_type: 'months', key: 'monthly', label: 'mes(es)', title: 'Mensal'},
]

export function groupBy(list, func, keyValidator){
    let map = [];
    list.forEach((item) => {
        let key = func(item);
        
        let i = -1;
        map.forEach((mapItem, index) => {
            if(i === -1 && (
                (mapItem[0] === key) ||
                (keyValidator && mapItem[0][keyValidator] === key[keyValidator])
            )) i = index;
        })
        
        if(i === -1) map.push([key, [item]])
        else map[i][1].push(item);
    })

    return map;
}

export function formatReais(value){
    // return `R$ ${(value ? value : 0).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}`
    return parseFloat(value ? value : 0).toLocaleString('pt-BR', {
        maximumFractionDigits: 2, 
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'BRL',
    })
}

export function getExtenseDate(date){
    date = moment(date)
    return date.format("DD") +
        " de " +
        getExtenseMonth(date.month()).toLowerCase() +  
        " de " +  
        date.format("YYYY") 
}

export function getExtenseDay(date){
    let mdate = moment(date)

    return mdate.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
    ? "Hoje"
    : mdate.format("YYYY-MM-DD") === moment().add(1, "days").format("YYYY-MM-DD")
        ? "Amanhã"
        : [
            `Segunda`, `Terça`, `Quarta`, `Quinta`, `Sexta`, `Sábado`, `Domingo`
        ][parseInt(mdate.format("E")) - 1] + ` - ${mdate.format('DD/MM')}`
}

export function weekdays(){
    let i = 0, ws = [];
    while(i < 7){
        ws.push({index: i, title: weekday(i)})
        i++;
    }
    return ws;
}

export const weekday = (index) => {
    return [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
    ][index]
}

export function months(){
    let i = 0, ms = [];
    while(i < 12){
        ms.push({index: i, title: getExtenseMonth(i)})
        i++;
    }
    return ms;
}

export function years(lastYear, firstYear){
    let i = firstYear || 2015, ys = [];
    while(i <= (lastYear || moment().year() + 10)){
        ys.push({index: i, title: i})
        i++;
    }
    return ys;
}

export function getExtenseMonth(month){
    return [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ][parseInt(month)]
}

export function getWeekDay(date){
    switch(moment(date).weekday()){
        case 0: return "Domingo";
        case 1: return "Segunda-feira";
        case 2: return "Terça-feira";
        case 3: return "Quarta-feira";
        case 4: return "Quinta-feira";
        case 5: return "Sexta-feira";
        case 6: return "Sábado";
        default: return "Domingo";
    }
}

export function validCpf(strCPF){
    let sum;
    let rest;
    sum = 0;
    strCPF = strCPF.replace(/\.|\-|\//g, '')
    if (!strCPF || strCPF === "00000000000") return false;
        
    for (let i=1; i<=9; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if ((rest == 10) || (rest == 11))  rest = 0;
    if (rest != parseInt(strCPF.substring(9, 10)) ) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    
    if ((rest == 10) || (rest == 11))  rest = 0;
    if (rest != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

export function formatCpf(cpf){
    if(!cpf) return null;
    else{
        let c = cpf.replace(/\.|\-|\//g, '')
        return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9, 11)}`
    }
}

export function formatCnpj(cnpj){
    if(!cnpj) return null;
    else{
        let c = cnpj.replace(/\.|\-|\//g, '')
        return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12, 14)}`
    }
}

export function removeAccents(str) 
{
    var string = str;
    var mapaAcentosHex = {
        a : /[\xE0-\xE6]/g,
        A : /[\xC0-\xC6]/g,
        e : /[\xE8-\xEB]/g,
        E : /[\xC8-\xCB]/g,
        i : /[\xEC-\xEF]/g,
        I : /[\xCC-\xCF]/g,
        o : /[\xF2-\xF6]/g,
        O : /[\xD2-\xD6]/g,
        u : /[\xF9-\xFC]/g,
        U : /[\xD9-\xDC]/g,
        c : /\xE7/g,
        C : /\xC7/g,
        n : /\xF1/g,
        N : /\xD1/g,
    }

    for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	return string;
} 

export const banks = [
    {text: "001 – Banco do Brasil S.A.", number: "001"},
    {text: "341 – Banco Itaú S.A.", number: "341"},
    {text: "033 – Banco Santander (Brasil) S.A.", number: "033"},
    {text: "356 – Banco Real S.A. (antigo)", number: "356"},
    {text: "652 – Itaú Unibanco Holding S.A.", number: "652"},
    {text: "237 – Banco Bradesco S.A.", number: "237"},
    {text: "745 – Banco Citibank S.A.", number: "745"},
    {text: "399 – HSBC Bank Brasil S.A. – Banco Múltiplo", number: "399"},
    {text: "104 – Caixa Econômica Federal", number: "104"},
    {text: "260 – Nubank", number: "260"},
    {text: "389 – Banco Mercantil do Brasil S.A.", number: "389"},
    {text: "453 – Banco Rural S.A.", number: "453"},
    {text: "422 – Banco Safra S.A.", number: "422"},
    {text: "633 – Banco Rendimento S.A.", number: "633"},
    {text: "246 – Banco ABC Brasil S.A.", number: "246"},
    {text: "025 – Banco Alfa S.A.", number: "025"},
    {text: "641 – Banco Alvorada S.A.", number: "641"},
    {text: "029 – Banco Banerj S.A.", number: "029"},
    {text: "038 – Banco Banestado S.A.", number: "038"},
    {text: "000 – Banco Bankpar S.A.", number: "000"},
    {text: "740 – Banco Barclays S.A.", number: "740"},
    {text: "107 – Banco BBM S.A.", number: "107"},
    {text: "031 – Banco Beg S.A.", number: "031"},
    {text: "096 – Banco BM&F de Serviços de Liquidação e Custódia S.A", number: "096"},
    {text: "318 – Banco BMG S.A.", number: "318"},
    {text: "752 – Banco BNP Paribas Brasil S.A.", number: "752"},
    {text: "248 – Banco Boavista Interatlântico S.A.", number: "248"},
    {text: "036 – Banco Bradesco BBI S.A.", number: "036"},
    {text: "204 – Banco Bradesco Cartões S.A.", number: "204"},
    {text: "225 – Banco Brascan S.A.", number: "225"},
    {text: "044 – Banco BVA S.A.", number: "044"},
    {text: "263 – Banco Cacique S.A.", number: "263"},
    {text: "473 – Banco Caixa Geral – Brasil S.A.", number: "473"},
    {text: "222 – Banco Calyon Brasil S.A.", number: "222"},
    {text: "040 – Banco Cargill S.A.", number: "040"},
    {text: "M08 – Banco Citicard S.A.", number: "M08"},
    {text: "M19 – Banco CNH Capital S.A.", number: "M19"},
    {text: "215 – Banco Comercial e de Investimento Sudameris S.A.", number: "215"},
    {text: "756 – Banco Cooperativo do Brasil S.A. – BANCOOB", number: "756"},
    {text: "748 – Banco Cooperativo Sicredi S.A.", number: "748"},
    {text: "505 – Banco Credit Suisse (Brasil) S.A.", number: "505"},
    {text: "229 – Banco Cruzeiro do Sul S.A.", number: "229"},
    {text: "003 – Banco da Amazônia S.A.", number: "003"},
    {text: "083-3 – Banco da China Brasil S.A.", number: "083"},
    {text: "707 – Banco Daycoval S.A.", number: "707"},
    {text: "M06 – Banco de Lage Landen Brasil S.A.", number: "M06"},
    {text: "024 – Banco de Pernambuco S.A. – BANDEPE", number: "024"},
    {text: "456 – Banco de Tokyo-Mitsubishi UFJ Brasil S.A.", number: "456"},
    {text: "214 – Banco Dibens S.A.", number: "214"},
    {text: "047 – Banco do Estado de Sergipe S.A.", number: "047"},
    {text: "037 – Banco do Estado do Pará S.A.", number: "037"},
    {text: "041 – Banco do Estado do Rio Grande do Sul S.A.", number: "041"},
    {text: "004 – Banco do Nordeste do Brasil S.A.", number: "004"},
    {text: "265 – Banco Fator S.A.", number: "265"},
    {text: "M03 – Banco Fiat S.A.", number: "M03"},
    {text: "224 – Banco Fibra S.A.", number: "224"},
    {text: "626 – Banco Ficsa S.A.", number: "626"},
    {text: "394 – Banco Finasa BMC S.A.", number: "394"},
    {text: "M18 – Banco Ford S.A.", number: "M18"},
    {text: "233 – Banco GE Capital S.A.", number: "233"},
    {text: "734 – Banco Gerdau S.A.", number: "734"},
    {text: "M07 – Banco GMAC S.A.", number: "M07"},
    {text: "612 – Banco Guanabara S.A.", number: "612"},
    {text: "M22 – Banco Honda S.A.", number: "M22"},
    {text: "063 – Banco Ibi S.A. Banco Múltiplo", number: "063"},
    {text: "M11 – Banco IBM S.A.", number: "M11"},
    {text: "604 – Banco Industrial do Brasil S.A.", number: "604"},
    {text: "320 – Banco Industrial e Comercial S.A.", number: "320"},
    {text: "653 – Banco Indusval S.A.", number: "653"},
    {text: "630 – Banco Intercap S.A.", number: "630"},
    {text: "249 – Banco Investcred Unibanco S.A.", number: "249"},
    {text: "184 – Banco Itaú BBA S.A.", number: "184"},
    {text: "479 – Banco ItaúBank S.A", number: "479"},
    {text: "M09 – Banco Itaucred Financiamentos S.A.", number: "M09"},
    {text: "376 – Banco J. P. Morgan S.A.", number: "376"},
    {text: "074 – Banco J. Safra S.A.", number: "074"},
    {text: "217 – Banco John Deere S.A.", number: "217"},
    {text: "065 – Banco Lemon S.A.", number: "065"},
    {text: "600 – Banco Luso Brasileiro S.A.", number: "600"},
    {text: "755 – Banco Merrill Lynch de Investimentos S.A.", number: "755"},
    {text: "746 – Banco Modal S.A.", number: "746"},
    {text: "151 – Banco Nossa Caixa S.A.", number: "151"},
    {text: "045 – Banco Opportunity S.A.", number: "045"},
    {text: "623 – Banco Panamericano S.A.", number: "623"},
    {text: "611 – Banco Paulista S.A.", number: "611"},
    {text: "643 – Banco Pine S.A.", number: "643"},
    {text: "638 – Banco Prosper S.A.", number: "638"},
    {text: "747 – Banco Rabobank International Brasil S.A.", number: "747"},
    {text: "M16 – Banco Rodobens S.A.", number: "M16"},
    {text: "072 – Banco Rural Mais S.A.", number: "072"},
    {text: "250 – Banco Schahin S.A.", number: "250"},
    {text: "749 – Banco Simples S.A.", number: "749"},
    {text: "366 – Banco Société Générale Brasil S.A.", number: "366"},
    {text: "637 – Banco Sofisa S.A.", number: "637"},
    {text: "464 – Banco Sumitomo Mitsui Brasileiro S.A.", number: "464"},
    {text: "082-5 – Banco Topázio S.A.", number: "082"},
    {text: "M20 – Banco Toyota do Brasil S.A.", number: "M20"},
    {text: "634 – Banco Triângulo S.A.", number: "634"},
    {text: "208 – Banco UBS Pactual S.A.", number: "208"},
    {text: "M14 – Banco Volkswagen S.A.", number: "M14"},
    {text: "655 – Banco Votorantim S.A.", number: "655"},
    {text: "610 – Banco VR S.A.", number: "610"},
    {text: "370 – Banco WestLB do Brasil S.A.", number: "370"},
    {text: "021 – BANESTES S.A. Banco do Estado do Espírito Santo", number: "021"},
    {text: "719 – Banif-Banco Internacional do Funchal (Brasil)S.A.", number: "719"},
    {text: "073 – BB Banco Popular do Brasil S.A.", number: "073"},
    {text: "078 – BES Investimento do Brasil S.A.-Banco de Investimento", number: "078"},
    {text: "069 – BPN Brasil Banco Múltiplo S.A.", number: "069"},
    {text: "070 – BRB – Banco de Brasília S.A.", number: "070"},
    {text: "477 – Citibank N.A.", number: "477"},
    {text: "081-7 – Concórdia Banco S.A.", number: "081"},
    {text: "487 – Deutsche Bank S.A. – Banco Alemão", number: "487"},
    {text: "751 – Dresdner Bank Brasil S.A. – Banco Múltiplo", number: "751"},
    {text: "062 – Hipercard Banco Múltiplo S.A.", number: "062"},
    {text: "492 – ING Bank N.V.", number: "492"},
    {text: "488 – JPMorgan Chase Bank", number: "488"},
    {text: "409 – UNIBANCO – União de Bancos Brasileiros S.A.", number: "409"},
    {text: "230 – Unicard Banco Múltiplo S.A.", number: "230"},
]