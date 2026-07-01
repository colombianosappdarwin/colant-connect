import { useEffect, useState } from "react"
import { updateProfile } from "../services/profileService"

function ProfileForm({ userProfile, onBack, onProfileUpdated }) {
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
    visa_type: ""
  })

  const [saving, setSaving] = useState(false)

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
        visa_type: userProfile.visa_type || ""
      })
    }
  }, [userProfile])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenderChange = (genderValue) => {
    setFormData((prev) => ({
      ...prev,
      gender: genderValue
    }))
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
          <button
            onClick={onBack}
            className="text-3xl"
          >
            ←
          </button>

          <h2 className="font-bold text-xl">
            Editar Perfil
          </h2>

          <button
            onClick={handleSubmit}
            className="text-red-500 font-bold text-sm"
          >
            GUARDAR
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-6xl">
              👤
            </div>

            <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
              📷
            </div>
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
                className={formData.gender === "M" || formData.gender === "Masculino" ? "bg-red-500 text-white py-3 font-bold" : "bg-white text-slate-700 py-3 font-bold"}
              >
                M
              </button>

              <button
                type="button"
                onClick={() => handleGenderChange("F")}
                className={formData.gender === "F" || formData.gender === "Femenino" ? "bg-red-500 text-white py-3 font-bold" : "bg-white text-slate-700 py-3 font-bold"}
              >
                F
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Fecha de nacimiento
            </label>
            <input
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              País
            </label>
            <input
              name="country_origin"
              value={formData.country_origin}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Ciudad de origen
            </label>
            <input
              name="city_origin"
              value={formData.city_origin}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Número de celular
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Fecha de llegada a Darwin
            </label>
            <input
              name="arrival_date"
              type="date"
              value={formData.arrival_date}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              ¿En qué industria trabajan?
            </label>
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 font-semibold">
              Tipo de Visa
            </label>
            <input
              name="visa_type"
              value={formData.visa_type}
              onChange={handleChange}
              className="w-full mt-1 p-4 rounded-2xl border border-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
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
