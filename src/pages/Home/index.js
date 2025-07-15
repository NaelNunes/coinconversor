import "./style.css";
import { useState } from "react";
import Select from "react-select";

export default function Home() {
  const [valueInput1, setValueInput1] = useState("0,00");
  const [valueInput2, setValueInput2] = useState("");

  const [selectedCountryLocal, setSelectedCountryLocal] = useState({ value: "BRL", label: "BRL - Real Brasileiro" });
  const [selectedCountryOuter, setSelectedCountryOuter] = useState({ value: "USD", label: "USD - Dólar Americano" });

  const options = [
    { value: "USD", label: "USD - Dólar Americano" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "BRL", label: "BRL - Real Brasileiro" },
    { value: "GBP", label: "GBP - Libra Esterlina" },
    { value: "JPY", label: "JPY - Iene Japonês" },
    { value: "AUD", label: "AUD - Dólar Australiano" },
    { value: "CAD", label: "CAD - Dólar Canadense" },
    { value: "CHF", label: "CHF - Franco Suíço" },
    { value: "CNY", label: "CNY - Yuan Chinês" },
    { value: "NZD", label: "NZD - Dólar Neozelandês" },
    { value: "MXN", label: "MXN - Peso Mexicano" },
    { value: "INR", label: "INR - Rúpia Indiana" },
    { value: "RUB", label: "RUB - Rublo Russo" },
    { value: "ZAR", label: "ZAR - Rand Sul-Africano" },
    { value: "KRW", label: "KRW - Won Sul-Coreano" },
    { value: "TRY", label: "TRY - Lira Turca" },
    { value: "SGD", label: "SGD - Dólar de Singapura" },
  ];

  const currencySymbols = {
    USD: "$",
    BRL: "R$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "Fr.",
    CNY: "¥",
    NZD: "NZ$",
    MXN: "$",
    INR: "₹",
    RUB: "₽",
    ZAR: "R",
    KRW: "₩",
    TRY: "₺",
    SGD: "S$",
  };

  const formatMoney = (num) => {
    return num
      .replace(/\D/g, "")
      .replace(/(\d)(\d{2})$/, "$1,$2")
      .replace(/(\d)(\d{3})(\d{3})$/, "$1.$2.$3")
      .replace(/(\d)(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
  };

  const handleChangeInput1 = (e) => {
    let valorInput = e.target.value;
    let valorNumerico = valorInput.replace(/\D/g, "");

    setValueInput1(formatMoney(valorNumerico));
  };

  const handleChangeSelect1 = (selectedOption) => {
    if (selectedOption.value !== selectedCountryOuter.value) {
      setSelectedCountryLocal(selectedOption);
    }
  };

  const handleChangeSelect2 = (selectedOption) => {
    if (selectedOption.value !== selectedCountryLocal.value) {
      setSelectedCountryOuter(selectedOption);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valorLimpo = valueInput1.replace(/\./g, "").replace(",", ".");

    try {
      const response = await fetch(
        `http://localhost:5000/api/converter?valueInput1=${valorLimpo}&selectedCountryLocal=${selectedCountryLocal.value}&selectedCountryOuter=${selectedCountryOuter.value}`
      );

      if (!response.ok) throw new Error("Erro na requisição");

      const resultado = await response.json();

      const symbol = currencySymbols[selectedCountryOuter.value] || selectedCountryOuter.value;

      setValueInput2(
        `${symbol} ${Number(resultado.valueInput2).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      );
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="home">
      <div className="title-Converter">Conversor de Moedas</div>
      <div className="converter-container">
        <div className="localCoin">
          <span className="spanLocalCoin">Quantia:</span>
          <div className="selectInputLocal">
            <input
              type="text"
              value={valueInput1}
              placeholder="0,00"
              className="converter-input"
              onChange={handleChangeInput1}
            />
            <div>
              <Select
                options={options}
                value={selectedCountryLocal}
                onChange={handleChangeSelect1}
                className="converter-language-selector"
                isSearchable={true}
              />
            </div>
          </div>
        </div>
        <div className="outerCoin">
          <span className="spanOuterCoin">Valor convertido:</span>
          <div className="selectInputOuter">
            <input type="text" className="converter-input" value={valueInput2} readOnly />
            <div>
              <Select
                options={options}
                value={selectedCountryOuter}
                onChange={handleChangeSelect2}
                className="converter-language-selector"
                isSearchable={true}
              />
            </div>
          </div>
        </div>
        <button className="converter-button" onClick={handleSubmit}>
          CONVERTER
        </button>
      </div>
    </div>
  );
}
