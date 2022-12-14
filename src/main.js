import "./css/index.css"
import IMask from "imask"

const cartaoBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)
const cartaoBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)
/*const cartaoBgColor03 = document.querySelector(
  ".cc-bg svg > g g:nth-child(3) path"
)*/
const cartaoLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    apple: ["#F73A67", "#0D0B2A"],
    default: ["black", "gray"]
  }

  cartaoBgColor01.setAttribute("fill", colors[type][0])
  cartaoBgColor02.setAttribute("fill", colors[type][1])
  //cartaoBgColor03.setAttribute("fill", colors[type][2])
  cartaoLogo.setAttribute("src", `cc-${type}.svg`)
}

//setCardType("mastercard")
globalThis.setCardType = setCardType //para mudar pelo console do navegador

const securityCode = document.getElementById('security-code');
const securityCodePattern = {
  mask: '0000'
};
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.getElementById("expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), //recebe o ano atual
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3\d{0,15}/,
      cardtype: "apple"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") //tudo que n??o ?? d??gito ?? substituido por vazio

    //{regex} pega somente a propriedade regex do objeto
    //se a express??o regular est?? de acordo com o regex e vai encontra a m??scara (sendo visa ou mastercard)
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
    /*const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })*/

    console.log(foundMask)
    return foundMask;
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)


const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cart??o adicionado com sucesso!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULADO DA SILVA" : cardHolder.value //if tern??rio
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(date){
  const ccDate = document.querySelector(".cc-expiration .value")
  ccDate.innerText = date.length === 0 ? "02/32" : date
}