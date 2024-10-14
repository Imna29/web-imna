<script setup lang="ts">
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect} from "@firebase/auth";
import {useUserStore} from "~/stores/userStore";
import {ArrowLeft} from "lucide-vue-next";


const auth = useFirebaseAuth();
const googleAuthProvider = new GoogleAuthProvider();

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");

async function loginWithGoogle() {
  await signInWithPopup(auth!, googleAuthProvider);
  await testUsername();
}

async function loginWithCredentials() {
  errorMessage.value = "";
  try {
    await signInWithEmailAndPassword(auth!, email.value, password.value);
    await testUsername();
  } catch (err: any) {
    if (err.code === 'auth/wrong-password') {
      errorMessage.value = "Password you entered is wrong.";
    } else if (err.code === 'auth/too-many-requests') {
      errorMessage.value = "Too many attempts. Try again later.";
    } else {
      errorMessage.value = "An error occurred. Please try again.";
    }
  }
}

async function testUsername() {
  try {
    const user = await useUserStore().getUser();

    if (!user) {
      navigateTo("/register/username");
    } else {
      //TODO: redirect to the redirect from query parameter
      navigateTo("/");
    }
  } catch (error: any) {
    navigateTo("/register/username");
  }
}
</script>

<template>
  <div class="m-auto pb-10 w-fit">
    <NuxtLink to="/">
      <div class="flex">
        <ArrowLeft class="inline"/>
        <div class="underline align-text-bottom">
          Home
        </div>
      </div>
    </NuxtLink>
    <Card class="max-w-sm mt-1">
      <template #title>Login</template>
      <template #subtitle>Enter your email below to login to your account
      </template>

      <template #content>
        <form @submit.prevent="loginWithCredentials">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <label for="email">Email</label>
              <InputText
                  id="email"
                  type="email"
                  placeholder="imna@example.com"
                  required
                  v-model="email"
              />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <label for="password">Password</label>
                <a href="#" class="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <InputText id="password" type="password" required v-model="password"/>
            </div>
            <div class="text-sm text-destructive" v-if="errorMessage">
              {{ errorMessage }}
            </div>
            <Button type="submit" class="w-full">
              Login
            </Button>
            <Button variant="outline" class="w-full" @click="loginWithGoogle">
              Login with Google
            </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/register" class="underline">
            Sign up
          </NuxtLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>