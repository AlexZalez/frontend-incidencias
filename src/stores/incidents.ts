import { supabase } from "@/lib/supabase"
import { defineStore } from "pinia"
import { ref } from "vue"

// Types
interface GroupForm {
  name: string
  shares: number // por defecto pon 100,
  unit: string // por defecto pon %
}

export const useIncidentsStore = defineStore("incidents", () => {
  const incidents = ref<Group[]>([])

  const incidentsListAction = () => {
    return new Promise((resolve, reject) => {
      supabase
        .from('report_emergency_services')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          incidents.value = data
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const incidentDeleteAction = (id: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase
          .from('report_emergency_services')
          .delete()
          .eq('id', id)

        if (error) throw error

        incidents.value = incidents.value.filter((inc: any) => inc?.id !== id)
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  const incidentUpdateAction = (
    form: Partial<{
      department: string
      position: string
      transferred: boolean
      destination: string | null
      affected_system: string
      diagnostic: string
      body_area: string
      observations: string
    }>,
    id: number,
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const payload = { ...form }
        if (payload.transferred === false) payload.destination = null

        const { data, error } = await supabase
          .from('report_emergency_services')
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        const idx = incidents.value.findIndex((inc: any) => inc.id === id)
        if (idx !== -1) incidents.value.splice(idx, 1, data)

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  }

  /*  const incidentGetAction = (id: number) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.url}/group/${id}`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const incidentStoreAction = (form: GroupForm) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.url}/group`, form)
        .then(({ data }: { data: Group }) => {
          groups.value.unshift(data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const incidentUpdatetAction = (form: GroupForm, id: number) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${config.url}/group/${id}`, form)
        .then(({ data }: { data: Group }) => {
          const i = groups.value.findIndex(
            (group: Group) => group.id === data.id,
          )

          groups.value.splice(i, 1, data)

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  } */

  return {
    incidents,
    incidentsListAction,
    incidentDeleteAction,
    incidentUpdateAction,
    // incidentGetAction,
    // incidentStoreAction,
    // incidentUpdatetAction,
  }
})
