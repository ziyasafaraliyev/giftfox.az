import { useState } from "react";
import { SectionHeader } from "./SectionHeader.jsx";
import { submitContactRequest } from "../services/contactApi.js";

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

export function Contact({ content }) {
  const [formData, setFormData] = useState(initialFormState);
  const [formState, setFormState] = useState({
    loading: false,
    successMessage: "",
    errorMessage: "",
    fieldErrors: {},
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormState((current) => ({
      ...current,
      fieldErrors: {
        ...current.fieldErrors,
        [name]: "",
      },
      successMessage: "",
      errorMessage: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormState({
      loading: true,
      successMessage: "",
      errorMessage: "",
      fieldErrors: {},
    });

    try {
      const response = await submitContactRequest(formData);

      setFormState({
        loading: false,
        successMessage: response.message,
        errorMessage: "",
        fieldErrors: {},
      });
      setFormData(initialFormState);
    } catch (error) {
      setFormState({
        loading: false,
        successMessage: "",
        errorMessage: error.message || "Something went wrong while sending your request.",
        fieldErrors: error.details || {},
      });
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container contact-layout">
        <div className="contact-copy">
          <SectionHeader label={content.label} title={content.title} description={content.description} />

          <div className="contact-info">
            <article className="glass-card contact-info__card">
              <span>Phone</span>
              <a href={`tel:${content.phone}`}>{content.phone}</a>
            </article>
            <article className="glass-card contact-info__card">
              <span>Email</span>
              <a href={`mailto:${content.email}`}>{content.email}</a>
            </article>
            <article className="glass-card contact-info__card">
              <span>Address</span>
              <p>{content.address}</p>
            </article>
          </div>

          <div className="contact-actions">
            <a className="button button--ghost" href={content.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>

        <div className="contact-stack">
          <form className="glass-card contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Full Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                {formState.fieldErrors.name ? <small>{formState.fieldErrors.name}</small> : null}
              </label>

              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+994 50 555 01 98"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
                {formState.fieldErrors.phone ? <small>{formState.fieldErrors.phone}</small> : null}
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {formState.fieldErrors.email ? <small>{formState.fieldErrors.email}</small> : null}
              </label>

              <label>
                <span>Service</span>
                <select name="service" value={formData.service} onChange={handleChange} required>
                  <option value="">Select a service</option>
                  {content.services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {formState.fieldErrors.service ? <small>{formState.fieldErrors.service}</small> : null}
              </label>
            </div>

            <label>
              <span>Project Details</span>
              <textarea
                name="message"
                rows="6"
                placeholder="Tell us about the property, style, timeline and what level of service you need."
                required
                value={formData.message}
                onChange={handleChange}
              />
              {formState.fieldErrors.message ? <small>{formState.fieldErrors.message}</small> : null}
            </label>

            {formState.errorMessage ? <p className="form-message form-message--error">{formState.errorMessage}</p> : null}
            {formState.successMessage ? (
              <p className="form-message form-message--success">{formState.successMessage}</p>
            ) : null}

            <button type="submit" className="button" disabled={formState.loading}>
              {formState.loading ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>

          <div className="glass-card contact-map">
            <iframe
              title="Ziya Construction location"
              src={content.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
