import React, { useState, useEffect, useContext } from "react";
import { CarsContext } from "../../context/CarsContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CarForm({ editingCar, onFinish }) {
  const { addCar, updateCar } = useContext(CarsContext);

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    preco: "",
    cor: "",
    km: "",
    descricao: "",
    foto: "",
  });

  useEffect(() => {
    if (editingCar) {
      setFormData({
        marca: editingCar.marca || "",
        modelo: editingCar.modelo || "",
        ano: editingCar.ano || "",
        preco: editingCar.preco || "",
        cor: editingCar.cor || "",
        km: editingCar.km || "",
        descricao: editingCar.descricao || "",
        foto: editingCar.foto || "",
      });
    } else {
      setFormData({
        marca: "",
        modelo: "",
        ano: "",
        preco: "",
        cor: "",
        km: "",
        descricao: "",
        foto: "",
      });
    }
  }, [editingCar]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carData = {
      ...formData,
      ano: parseInt(formData.ano) || 0,
      preco: parseFloat(formData.preco) || 0,
      km: parseInt(formData.km) || 0,
    };

    let ok;
    if (editingCar) {
      ok = await updateCar(editingCar.id, carData);
    } else {
      ok = await addCar(carData);
    }

    if (ok) {
      setFormData({
        marca: "",
        modelo: "",
        ano: "",
        preco: "",
        cor: "",
        km: "",
        descricao: "",
        foto: "",
      });
      if (onFinish) onFinish();
    } else {
      alert("Erro ao guardar carro.");
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

      <Input
        label="Marca"
        name="marca"
        value={formData.marca}
        onChange={(e) => updateField("marca", e.target ? e.target.value : e)}
        placeholder="Ex: Toyota, Ferrari..."
        required
      />

      <Input
        label="Modelo"
        name="modelo"
        value={formData.modelo}
        onChange={(e) => updateField("modelo", e.target ? e.target.value : e)}
        required
      />

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

      <div style={{ display: "flex", gap: "1rem" }}>
        <Input
          label="Cor"
          name="cor"
          value={formData.cor}
          onChange={(e) => updateField("cor", e.target ? e.target.value : e)}
        />
        <Input
          label="Quilometragem"
          name="km"
          type="number"
          value={formData.km}
          onChange={(e) => updateField("km", e.target ? e.target.value : e)}
        />
      </div>

      <Input
        label="URL da Foto"
        name="foto"
        value={formData.foto}
        onChange={(e) => updateField("foto", e.target ? e.target.value : e)}
        placeholder="https://..."
      />

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
