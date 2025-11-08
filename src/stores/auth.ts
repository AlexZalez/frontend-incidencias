import { useCookie } from "@/composables/useCookie"
import { supabase } from "@/lib/supabase"
// import { useLoaderStore as useLoader } from "@/store/loader"
import type { Staff, User } from "@/utils/types/types"
import { defineStore } from "pinia"
import { ref } from "vue"

import { useRouter } from "vue-router"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User>()
  const staff = ref<Staff>()
  const token = useCookie("token")

  const router = useRouter()
  //   const { setLoading } = useLoader()

  interface loginForm {
    email: string
    password: string
  }

  const userLoginAction = (form: loginForm) => {
    return new Promise((resolve, reject) => {
      supabase.auth.signInWithPassword(form)
        .then(({data}) => {
        //   setLoading(true)
          console.log(data);
            
          token.value = data.session.access_token

          user.value = data.user

          router.push("/home/dashboard")

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }



  const userWhoiamAction = () => {
    return new Promise((resolve, reject) => {
      supabase.auth.getUser()
        .then(({ data }) => {
          if (data.user === null) {
            throw new Error("No authenticated")
          }
          user.value = data.user
          //   staff.value = data.staff
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          
          router.push("/").then(() => {
            router.go(0)
          })
          reject(error)
        })
    })
  }


  /*   const userRecoverPasswordAction = (email: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.url}/user/recoverpassword?email=${email}`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  */
  const userLogOutAction = () => {
    token.value = null

    return new Promise((resolve, reject) => {
      supabase.auth.signOut()
        .then(response => {
          token.value = null
          router.push("/").then(() => {
            router.go(0)
          })
          user.value = undefined
          resolve(response)
        })
        .catch(error => {
          router.push("/").then(() => {
            router.go(0)
          })
          reject(error)
        })
    })
  }
  return {
    user,
    staff,
    token,
    userLoginAction,
    userWhoiamAction,
    userLogOutAction,
  }
})
