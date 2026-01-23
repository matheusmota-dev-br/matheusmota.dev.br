import { useState, type ChangeEvent, type FormEvent } from "react";
import { actions } from "@/lib";
import cvData from "@/config/cv.json";

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    actions.sendEmail({
      from: formData.email,
      subject: '[DEV PORTFOLIO] New Job 💼',
      text: formData.message,
      to: cvData.basic.email,
      cc: formData.email,
    });

    setFormData({
      name: '',
      email: '',
      message: '',
    });
  }

  return (
    <section className="py-5 px-4 sm:py-10 lg:py-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold text-center capitalize lg:text-4xl my-8">
            Let's work together
          </h1>
          <form
            method="POST"
            className="block w-full space-y-4"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-y-2">
              <span>Name</span>
              <input
                className="rounded-md bg-offset px-4 py-2 outline-none"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-y-2">
              <span>Email</span>
              <input
                className="rounded-md bg-offset px-4 py-2 outline-none"
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="flex flex-col gap-y-2">
              <span>Message</span>
              <textarea
                className="rounded-md bg-offset px-4 py-2 min-h-32 outline-none"
                name="message"
                placeholder="Let's work together"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className=" w-full px-10 py-4 text-base text-center font-semibold transition-all duration-200 rounded bg-primary hover:scale-110 focus:bg-secondary text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
