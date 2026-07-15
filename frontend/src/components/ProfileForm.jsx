import { useEffect, useRef, useState } from "react"
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

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || "",
        gender: userProfile.gender || "",
        email: userProfile.email || "",
        birth_date: userProfile.birth_date || "",
        country_origin: userProfile.country_origin || "",
        city_origin: userProfile.city_origin || "",
        phone: userProfile.phone || "",
        arrival_date: userProfile.arrival_date || "",
        industry: userProfile.industry || "",
        visa_type: userProfile.visa_type || "",
        profile_photo_url: userProfile.profile_photo_url || "",
      })
    }
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

    try {
      setSaving(true)

      const updatedProfile = await updateProfile(formData)

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
              className="mt-1 w-full rounded-2xl border border-slate-200 p-4"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-500">
              Tipo de sexo
            </label>

            <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-2xl border">
              <button
                type="button"
                onClick={() => handleGenderChange("M")}
                className={
                  formData.gender === "M" ||
                  formData.gender === "Masculino"
                    ? "bg-red-500 py-3 font-bold text-white"
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
                    ? "bg-red-500 py-3 font-bold text-white"
                    : "bg-white py-3 font-bold text-slate-700"
                }
              >
                F
              </button>
            </div>
          </div>

          {[
            ["email", "Email", "email"],
            ["birth_date", "Fecha de nacimiento", "date"],
            ["country_origin", "País", "text"],
            ["city_origin", "Ciudad de origen", "text"],
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
                className="mt-1 w-full rounded-2xl border border-slate-200 p-4"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="mt-4 w-full rounded-2xl bg-red-500 py-4 font-bold text-white disabled:opacity-60"
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