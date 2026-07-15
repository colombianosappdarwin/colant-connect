import { useEffect, useRef, useState } from "react"
import Select from "react-select"
import { Country, City } from "country-state-city"
import { updateProfile } from "../services/profileService"

function ProfileForm({ userProfile, onBack, onProfileUpdated }) {
  const fileInputRef = useRef(null)

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
    profile_photo_url: "",
  })

  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }))

  const cities = formData.country_origin
    ? City.getCitiesOfCountry(formData.country_origin).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : []

  useEffect(() => {
    if (!userProfile) return

    const savedCountry = Country.getAllCountries().find(
      (country) =>
        country.isoCode === userProfile.country_origin ||
        country.name === userProfile.country_origin
    )

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
      profile_photo_url: userProfile.profile_photo_url || "",
    })
  }, [userProfile])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenderChange = (genderValue) => {
    setFormData((prev) => ({
      ...prev,
      gender: genderValue,
    }))
  }

  const handleCountryChange = (selectedCountry) => {
    setFormData((prev) => ({
      ...prev,
      country_origin: selectedCountry?.value || "",
      city_origin: "",
    }))
  }

  const handleCityChange = (selectedCity) => {
    setFormData((prev) => ({
      ...prev,
      city_origin: selectedCity?.value || "",
    }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.")
      return
    }

    try {
      setUploadingPhoto(true)

      const cloudName = "dtlmi9fgx"
      const uploadPreset = "colant_profiles"

      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("upload_preset", uploadPreset)
      uploadData.append("folder", "colant/profile-photos")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error("Cloudinary error:", data)

        alert(
          data?.error?.message ||
            "No fue posible subir la foto a Cloudinary."
        )

        return
      }

      if (!data.secure_url) {
        alert("Cloudinary no devolvió la URL de la imagen.")
        return
      }

      setFormData((prev) => ({
        ...prev,
        profile_photo_url: data.secure_url,
      }))
    } catch (error) {
      console.error(error)
      alert("Error subiendo la foto.")
    } finally {
      setUploadingPhoto(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.country_origin) {
      alert("Selecciona un país.")
      return
    }

    if (!formData.city_origin) {
      alert("Selecciona una ciudad.")
      return
    }

    try {
      setSaving(true)

      const selectedCountry = Country.getCountryByCode(
        formData.country_origin
      )

      const profileData = {
        ...formData,
        country_origin:
          selectedCountry?.name || formData.country_origin,
      }

      const updatedProfile = await updateProfile(profileData)

      onProfileUpdated(updatedProfile)

      alert("Perfil actualizado correctamente")
      onBack()
    } catch (error) {
      console.error(error)
      alert("Error al guardar los cambios del perfil")
    } finally {
      setSaving(false)
    }
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "58px",
      borderRadius: "16px",
      borderColor: state.isFocused ? "#94a3b8" : "#e2e8f0",
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
      color: state.isSelected ? "#ffffff" : "#0f172a",
    }),
  }

  return (
    <div className="min-h-[calc(100vh-110px)] bg-white">
      <div className="rounded-b-[28px] bg-slate-950 px-5 pb-20 pt-8 text-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-3xl"
          >
            ←
          </button>

          <h2 className="text-xl font-bold">
            Editar Perfil
          </h2>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || uploadingPhoto}
            className="text-sm font-bold text-red-500 disabled:opacity-60"
          >
            GUARDAR
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            {formData.profile_photo_url ? (
              <img
                src={formData.profile_photo_url}
                alt="Profile"
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
              Nombre
            </label>

            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              Tipo de sexo
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
                M
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
                F
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              Fecha de nacimiento
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
              País
            </label>

            <div className="mt-1">
              <Select
                options={countries}
                value={
                  countries.find(
                    (country) =>
                      country.value === formData.country_origin
                  ) || null
                }
                onChange={handleCountryChange}
                placeholder="Selecciona un país"
                isSearchable
                styles={selectStyles}
                noOptionsMessage={() => "No se encontraron países"}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              Ciudad de origen
            </label>

            <div className="mt-1">
              <Select
                options={cities}
                value={
                  cities.find(
                    (city) =>
                      city.value === formData.city_origin
                  ) || null
                }
                onChange={handleCityChange}
                placeholder={
                  formData.country_origin
                    ? "Selecciona una ciudad"
                    : "Primero selecciona un país"
                }
                isDisabled={!formData.country_origin}
                isSearchable
                styles={selectStyles}
                noOptionsMessage={() => "No se encontraron ciudades"}
              />
            </div>
          </div>

          {[
            ["phone", "Número de celular", "text"],
            ["arrival_date", "Fecha de llegada a Darwin", "date"],
            ["industry", "¿En qué industria trabajan?", "text"],
            ["visa_type", "Tipo de Visa", "text"],
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

          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving
              ? "Guardando..."
              : uploadingPhoto
                ? "Subiendo foto..."
                : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm