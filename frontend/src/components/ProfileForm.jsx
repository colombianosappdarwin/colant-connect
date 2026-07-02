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
    fileInputRef.current.click()
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    try {
      setUploadingPhoto(true)

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        alert("Faltan las variables de Cloudinary en Railway.")
        return
      }

      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("upload_preset", uploadPreset)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      )

      const data = await response.json()

      if (!data.secure_url) {
        alert("Cloudinary no devolvió la URL de la imagen.")
        return
      }

      setFormData((prev) => ({
        ...prev,
        profile_photo_url: data.secure_url,
      }))
    } catch (error) {
      console.log(error)
      alert("Error subiendo la foto.")
    } finally {
      setUploadingPhoto(false)
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
      console.log(error)
      alert("Error al guardar los cambios del perfil")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white min-h-[calc(100vh-110px)]">
      <div className="bg-slate-950 text-white px-5 pt-8 pb-20 rounded-b-[28px]">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-3xl">
            ←
          </button>

          <h2 className="font-bold text-xl">Editar Perfil</h2>

          <button
            type="button"
            onClick={handleSubmit}
            className="text-red-500 font-bold text-sm"
          >
            GUARDAR
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="relative">
            {formData.profile_photo_url ? (
              <img
                src={formData.profile_photo_url}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-6xl">
                👤
              </div>
            )}

            <button
              type="button"
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
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

      <form onSubmit={handleSubmit} className="-mt-10 px-5 pb-8">
        <div className="bg-white rounded-[28px] shadow-lg border border-slate-100 p-5 space-y-4">
          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Nombre
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Tipo de sexo
            </label>

            <div className="grid grid-cols-2 mt-2 border rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => handleGenderChange("M")}
                className={
                  formData.gender === "M" || formData.gender === "Masculino"
                    ? "bg-red-500 text-white py-3 font-bold"
                    : "bg-white text-slate-700 py-3 font-bold"
                }
              >
                M
              </button>

              <button
                type="button"
                onClick={() => handleGenderChange("F")}
                className={
                  formData.gender === "F" || formData.gender === "Femenino"
                    ? "bg-red-500 text-white py-3 font-bold"
                    : "bg-white text-slate-700 py-3 font-bold"
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
              <label className="text-sm text-slate-500 font-semibold">
                {label}
              </label>

              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold mt-4 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm