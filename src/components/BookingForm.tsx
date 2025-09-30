import React, { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке");
      }

      alert("Заявка отправлена!"); // заменишь на свой toast
      setFormData({ name: "", phone: "", service: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки!"); // заменишь на toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Имя"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Телефон"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        type="text"
        placeholder="Услуга"
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
      />
      <textarea
        placeholder="Комментарий"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить заявку"}
      </button>
    </form>
  );
}
