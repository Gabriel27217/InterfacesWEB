import React, { useState, useEffect, useContext } from "react";
import { CarsContext } from "../../context/CarsContext"; // Contexto para gerir carros
import Input from "../ui/Input"; // Componente Input estilizado
import Button from "../ui/Button"; // Componente Button estilizado

// O componente recebe props:
// - editingCar: se não for null, indica que estamos editando um carro existente
// - onFinish: função callback para ser chamada após concluir o submit ou cancelar
export default function CarForm({ editingCar, onFinish }) {
  const { addCar, updateCar } = useContext(CarsContext); // Métodos do contexto de carros

  // Estado do formulário
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    preco: "",
    cor: "",
    quilometragem: "",
    descricao: "",
    foto: "",
  });

  // Atualiza o formulário caso estejamos a editar um carro
  useEffect(() => {
    if (editingCar) {
      setFormData({
        marca: editingCar.marca || "",
        modelo: editingCar.modelo || "",
        ano: editingCar.ano || "",
        preco: editingCar.preco || "",
        cor: editingCar.cor || "",
        quilometragem: editingCar.quilometragem || "",
        descricao: editingCar.descricao || "",
        foto: editingCar.foto || "",
      });
    } else {
      // Se não estiver a editar, limpa o formulário
      setFormData({
        marca: "",
        modelo: "",
        ano: "",
        preco: "",
        cor: "",
        quilometragem: "",
        descricao: "",
        foto: "",
      });
    }
  }, [editingCar]); // Executa sempre que editingCar mudar

  // Atualiza um campo específico do formulário
  // name = nome do campo, value = valor do campo
  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função chamada ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte campos numéricos para número
    const carData = {
      ...formData,
      ano: parseInt(formData.ano) || 0,
      preco: parseFloat(formData.preco) || 0,
      quilometragem: parseInt(formData.quilometragem) || 0,
    };

    let result;
    if (editingCar) {
      // Se estamos a editar, chamamos updateCar
      result = await updateCar(editingCar.id, carData);
    } else {
      // Se é um carro novo, chamamos addCar
      result = await addCar(carData);
    }

    if (result.ok) {
      // Limpa o formulário após sucesso
      setFormData({
        marca: "",
        modelo: "",
        ano: "",
        preco: "",
        cor: "",
        quilometragem: "",
        descricao: "",
        foto: "",
      });
      if (onFinish) onFinish(); // Callback opcional para avisar que terminou
    } else {
      alert(result.message); // Mostra erro se houver
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "2rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{editingCar ? "Editar Carro" : "Adicionar Carro"}</h3>

      {/* CAMPO MARCA */}
      <Input
        label="Marca"
        name="marca"
        value={formData.marca}
        onChange={(e) => updateField("marca", e.target ? e.target.value : e)}
        placeholder="Ex: Toyota, Ferrari..."
        required
      />

      {/* CAMPO MODELO */}
      <Input
        label="Modelo"
        name="modelo"
        value={formData.modelo}
        onChange={(e) => updateField("modelo", e.target ? e.target.value : e)}
        required
      />

      {/* CAMPO ANO E PREÇO EM FLEXBOX */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Input
          label="Ano"
          name="ano"
          type="number"
          value={formData.ano}
          onChange={(e) => updateField("ano", e.target ? e.target.value : e)}
          required
        />
        <Input
          label="Preço (€)"
          name="preco"
          type="number"
          value={formData.preco}
          onChange={(e) => updateField("preco", e.target ? e.target.value : e)}
          required
        />
      </div>

      {/* CAMPO COR E QUILOMETRAGEM */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Input
          label="Cor"
          name="cor"
          value={formData.cor}
          onChange={(e) => updateField("cor", e.target ? e.target.value : e)}
        />
        <Input
          label="Quilometragem"
          name="quilometragem"
          type="number"
          value={formData.quilometragem}
          onChange={(e) =>
            updateField("quilometragem", e.target ? e.target.value : e)
          }
        />
      </div>

      {/* CAMPO FOTO */}
      <Input
        label="URL da Foto"
        name="foto"
        value={formData.foto}
        onChange={(e) => updateField("foto", e.target ? e.target.value : e)}
        placeholder="https://..."
      />

      {/* CAMPO DESCRIÇÃO */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Descrição
        </label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={(e) => updateField("descricao", e.target.value)}
          rows="3"
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* BOTÕES */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button type="submit">
          {editingCar ? "Atualizar" : "Adicionar Carro"}
        </Button>
        {editingCar && (
          <Button
            type="button"
            style={{ backgroundColor: "#6c757d" }}
            onClick={onFinish}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}