import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city";
import { updateProfile } from "../services/profileService";

function ProfileForm({
  userProfile,
  onBack,
  onProfileUpdated,
  language = "es",
  changeLanguage,
}) {
  const fileInputRef = useRef(null);

  const translations = {
    es: {
      editProfile: "Editar perfil",
      saveTop: "GUARDAR",
      saveChanges: "Guardar cambios",
      saving: "Guardando...",
      uploadingPhoto: "Subiendo foto...",
      fullName: "Nombre completo",
      gender: "Sexo",
      male: "M",
      female: "F",
      email: "Correo electrónico",
      birthDate: "Fecha de nacimiento",
      country: "País de origen",
      city: "Ciudad de origen",
      phone: "Número de celular",
      arrivalDate: "Fecha de llegada a Australia",
      industry: "Industria en la que trabajas",
      visaType: "Tipo de visa",
      preferredLanguage: "Idioma preferido",
      spanish: "Español",
      english: "English",
      selectCountry: "Selecciona un país",
      selectCity: "Selecciona una ciudad",
      selectCountryFirst: "Primero selecciona un país",
      noCountries: "No se encontraron países",
      noCities: "No se encontraron ciudades",
      profilePhotoAlt: "Foto de perfil",
      invalidImage: "Selecciona una imagen válida.",
      cloudinaryUploadError:
        "No fue posible subir la foto a Cloudinary.",
      missingImageUrl:
        "Cloudinary no devolvió la URL de la imagen.",
      uploadError: "Error al subir la foto.",
      selectCountryAlert: "Selecciona un país.",
      selectCityAlert: "Selecciona una ciudad.",
      profileUpdated: "Perfil actualizado correctamente.",
      profileUpdateError:
        "Error al guardar los cambios del perfil.",
    },
    en: {
      editProfile: "Edit profile",
      saveTop: "SAVE",
      saveChanges: "Save changes",
      saving: "Saving...",
      uploadingPhoto: "Uploading photo...",
      fullName: "Full name",
      gender: "Gender",
      male: "M",
      female: "F",
      email: "Email address",
      birthDate: "Date of birth",
      country: "Country of origin",
      city: "City of origin",
      phone: "Phone number",
      arrivalDate: "Arrival date in Australia",
      industry: "Industry you work in",
      visaType: "Visa type",
      preferredLanguage: "Preferred language",
      spanish: "Español",
      english: "English",
      selectCountry: "Select a country",
      selectCity: "Select a city",
      selectCountryFirst: "Select a country first",
      noCountries: "No countries found",
      noCities: "No cities found",
      profilePhotoAlt: "Profile photo",
      invalidImage: "Select a valid image.",
      cloudinaryUploadError:
        "The photo could not be uploaded to Cloudinary.",
      missingImageUrl:
        "Cloudinary did not return an image URL.",
      uploadError: "Error uploading the photo.",
      selectCountryAlert: "Select a country.",
      selectCityAlert: "Select a city.",
      profileUpdated: "Profile updated successfully.",
      profileUpdateError:
        "Error saving the profile changes.",
    },
  };

  const t = translations[language] || translations.es;

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    email: "",
    birth_date: "",
    country_origin: "",
    city_origin: "",
    phone: "",
    arrival_date: "",
    industry: "",
    visa_type: "",
    preferred_language: language,
    profile_photo_url: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const countries = useMemo(
    () =>
      Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    []
  );

  const cities = useMemo(() => {
    if (!formData.country_origin) {
      return [];
    }

    return City.getCitiesOfCountry(formData.country_origin).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
  }, [formData.country_origin]);

  useEffect(() => {
    if (!userProfile) return;

    const savedCountry = Country.getAllCountries().find(
      (country) =>
        country.isoCode === userProfile.country_origin ||
        country.name === userProfile.country_origin
    );

    setFormData({
      full_name: userProfile.full_name || "",
      gender: userProfile.gender || "",
      email: userProfile.email || "",
      birth_date: userProfile.birth_date || "",
      country_origin: savedCountry?.isoCode || "",
      city_origin: userProfile.city_origin || "",
      phone: userProfile.phone || "",
      arrival_date: userProfile.arrival_date || "",
      industry: userProfile.industry || "",
      visa_type: userProfile.visa_type || "",
      preferred_language:
        userProfile.preferred_language || language,
      profile_photo_url:
        userProfile.profile_photo_url || "",
    });
  }, [userProfile, language]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGenderChange = (genderValue) => {
    setFormData((previous) => ({
      ...previous,
      gender: genderValue,
    }));
  };

  const handleCountryChange = (selectedCountry) => {
    setFormData((previous) => ({
      ...previous,
      country_origin: selectedCountry?.value || "",
      city_origin: "",
    }));
  };

  const handleCityChange = (selectedCity) => {
    setFormData((previous) => ({
      ...previous,
      city_origin: selectedCity?.value || "",
    }));
  };

  const handleLanguageChange = (selectedLanguage) => {
    setFormData((previous) => ({
      ...previous,
      preferred_language: selectedLanguage,
    }));

    localStorage.setItem("language", selectedLanguage);

    if (changeLanguage) {
      changeLanguage(selectedLanguage);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(t.invalidImage);
      return;
    }

    try {
      setUploadingPhoto(true);

      const cloudName = "dtlmi9fgx";
      const uploadPreset = "colant_profiles";

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);
      uploadData.append(
        "folder",
        "colant/profile-photos"
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error:", data);

        alert(
          data?.error?.message ||
            t.cloudinaryUploadError
        );

        return;
      }

      if (!data.secure_url) {
        alert(t.missingImageUrl);
        return;
      }

      setFormData((previous) => ({
        ...previous,
        profile_photo_url: data.secure_url,
      }));
    } catch (error) {
      console.error(error);
      alert(t.uploadError);
    } finally {
      setUploadingPhoto(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.country_origin) {
      alert(t.selectCountryAlert);
      return;
    }

    if (!formData.city_origin) {
      alert(t.selectCityAlert);
      return;
    }

    try {
      setSaving(true);

      const selectedCountry = Country.getCountryByCode(
        formData.country_origin
      );

      const profileData = {
        ...formData,
        country_origin:
          selectedCountry?.name ||
          formData.country_origin,
      };

      const updatedProfile =
        await updateProfile(profileData);

      onProfileUpdated(updatedProfile);

      if (
        updatedProfile?.preferred_language &&
        changeLanguage
      ) {
        changeLanguage(
          updatedProfile.preferred_language
        );
      }

      alert(t.profileUpdated);
      onBack();
    } catch (error) {
      console.error(error);

      alert(
        typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : t.profileUpdateError
      );
    } finally {
      setSaving(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "58px",
      borderRadius: "16px",
      borderColor: state.isFocused
        ? "#94a3b8"
        : "#e2e8f0",
      boxShadow: "none",
      paddingLeft: "6px",
      paddingRight: "6px",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0f172a",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
      borderRadius: "16px",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#0f172a"
        : state.isFocused
          ? "#f1f5f9"
          : "#ffffff",
      color: state.isSelected
        ? "#ffffff"
        : "#0f172a",
    }),
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-white">
      <div className="rounded-b-[28px] bg-slate-950 px-5 pb-20 pt-8 text-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-3xl"
            aria-label={t.editProfile}
          >
            ←
          </button>

          <h2 className="text-xl font-bold">
            {t.editProfile}
          </h2>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || uploadingPhoto}
            className="text-sm font-bold text-red-500 disabled:opacity-60"
          >
            {t.saveTop}
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            {formData.profile_photo_url ? (
              <img
                src={formData.profile_photo_url}
                alt={t.profilePhotoAlt}
                className="h-28 w-28 rounded-full border-4 border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-6xl">
                👤
              </div>
            )}

            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg disabled:opacity-60"
              aria-label={t.uploadingPhoto}
            >
              {uploadingPhoto ? "..." : "📷"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="-mt-10 px-5 pb-8"
      >
        <div className="space-y-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-lg">
          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.fullName}
            </label>

            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.gender}
            </label>

            <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleGenderChange("M")}
                className={
                  formData.gender === "M" ||
                  formData.gender === "Masculino"
                    ? "bg-slate-950 py-3 font-bold text-white"
                    : "bg-white py-3 font-bold text-slate-700"
                }
              >
                {t.male}
              </button>

              <button
                type="button"
                onClick={() => handleGenderChange("F")}
                className={
                  formData.gender === "F" ||
                  formData.gender === "Femenino"
                    ? "bg-slate-950 py-3 font-bold text-white"
                    : "bg-white py-3 font-bold text-slate-700"
                }
              >
                {t.female}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.email}
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.birthDate}
            </label>

            <input
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.country}
            </label>

            <div className="mt-1">
              <Select
                options={countries}
                value={
                  countries.find(
                    (country) =>
                      country.value ===
                      formData.country_origin
                  ) || null
                }
                onChange={handleCountryChange}
                placeholder={t.selectCountry}
                isSearchable
                styles={selectStyles}
                noOptionsMessage={() => t.noCountries}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.city}
            </label>

            <div className="mt-1">
              <Select
                options={cities}
                value={
                  cities.find(
                    (city) =>
                      city.value ===
                      formData.city_origin
                  ) || null
                }
                onChange={handleCityChange}
                placeholder={
                  formData.country_origin
                    ? t.selectCity
                    : t.selectCountryFirst
                }
                isDisabled={!formData.country_origin}
                isSearchable
                styles={selectStyles}
                noOptionsMessage={() => t.noCities}
              />
            </div>
          </div>

          {[
            ["phone", t.phone, "text"],
            [
              "arrival_date",
              t.arrivalDate,
              "date",
            ],
            ["industry", t.industry, "text"],
            ["visa_type", t.visaType, "text"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="text-sm font-semibold text-slate-500">
                {label}
              </label>

              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-slate-500">
              {t.preferredLanguage}
            </label>

            <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() =>
                  handleLanguageChange("es")
                }
                className={
                  formData.preferred_language === "es"
                    ? "bg-slate-950 py-3 font-bold text-white"
                    : "bg-white py-3 font-bold text-slate-700"
                }
              >
                {t.spanish}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLanguageChange("en")
                }
                className={
                  formData.preferred_language === "en"
                    ? "bg-slate-950 py-3 font-bold text-white"
                    : "bg-white py-3 font-bold text-slate-700"
                }
              >
                {t.english}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving
              ? t.saving
              : uploadingPhoto
                ? t.uploadingPhoto
                : t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;