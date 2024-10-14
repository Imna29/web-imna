<script setup lang="ts">
import { z } from "zod";
import { useForm, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { useUserStore } from "~/stores/userStore";
import { ArrowLeft } from "lucide-vue-next";

const authStore = useAuthStore();
const errorRef = ref<string>("");
const toast = useToast();

const registerSchema = z
    .object({
        username: z
            .string()
            .min(2, "Username is too short")
            .max(25, "Username is too long")
            .describe("Username"),
        email: z
            .string()
            .email("That does not look like an email address")
            .describe("Email"),
        password: z
            .string()
            .min(6, "Password is too short")
            .max(50, "Password is too long")
            .describe("Password"),
        confirm: z.string().describe("Confirm password"),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords must match.",
        path: ["confirm"],
    });

const { handleSubmit, errors, defineField } = useForm({
    validationSchema: toTypedSchema(registerSchema),
});

const onRegisterSubmit = handleSubmit(async (values) => {
    errorRef.value = "";
    try {
        console.log(values);
        await authStore.registerUser(
            values.username,
            values.email,
            values.password,
        );

        toast.add({
            severity: "success",
            summary: "Success!",
            detail: "Your account has been created. You can login now.",
        });

        navigateTo("/login");
    } catch (error: any) {
        if (error.statusCode === 400) {
            if (error.response._data.message instanceof Array) {
                errorRef.value = error.response._data.message.join(", ");
            } else {
                errorRef.value = error.response._data.message;
            }
        }
    }
});

const [username, usernameAttrs] = defineField("username");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirm, confirmAttrs] = defineField("confirm");

const auth = useFirebaseAuth();
const provider = new GoogleAuthProvider();

async function loginWithGoogle() {
    await signInWithPopup(auth!, provider);
    try {
        const user = await useUserStore().getUser();

        if (!user) {
            navigateTo("/register/username");
        } else {
            navigateTo("/");
        }
    } catch (error: any) {
        navigateTo("/register/username");
    }
}
</script>

<template>
    <div class="mt-auto mb-auto mx-auto pb-10">
        <NuxtLink to="/">
            <div class="flex">
                <ArrowLeft class="inline" />
                <div class="underline align-text-bottom">Home</div>
            </div>
        </NuxtLink>
        <Card class="mx-auto max-w-sm mt-1">
            <template #title>Sign Up</template>
            <template #subtitle
                >Enter your information to create an account</template
            >

            <template #content>
                <Form @submit="onRegisterSubmit()">
                    <div class="text-sm text-">{{ errorRef }}</div>

                    <div class="grid gap-2">
                        <label for="username">
                            Username<span class="text-red-500">*</span>
                        </label>
                        <InputText
                            id="username"
                            v-model="username"
                            type="text"
                        />
                        <span class="text-sm text-destructive">{{
                            errors.username
                        }}</span>
                    </div>

                    <div class="grid gap-2">
                        <label for="email">
                            Email<span class="text-red-500">*</span>
                        </label>
                        <InputText id="email" v-model="email" type="email" />
                        <span class="text-sm text-destructive">{{
                            errors.email
                        }}</span>
                    </div>

                    <div class="grid gap-2">
                        <label for="password">
                            Password<span class="text-red-500">*</span>
                        </label>
                        <InputText
                            id="password"
                            v-model="password"
                            type="password"
                        />
                        <span class="text-sm text-destructive">{{
                            errors.password
                        }}</span>
                    </div>

                    <div class="grid gap-2">
                        <label for="confirm">
                            Confirm Password<span class="text-red-500">*</span>
                        </label>
                        <InputText
                            id="confirm"
                            v-model="confirm"
                            type="password"
                        />
                        <span class="text-sm text-destructive">{{
                            errors.confirm
                        }}</span>
                    </div>

                    <div class="grid gap-2 mt-2">
                        <Button type="submit" class="w-full"
                            >Create an account</Button
                        >
                        <Button
                            variant="outline"
                            class="w-full"
                            @click.prevent="loginWithGoogle"
                        >
                            Sign up with Google
                        </Button>
                    </div>
                </Form>

                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <NuxtLink to="/login" class="underline">Sign in</NuxtLink>
                </div>
            </template>
        </Card>
    </div>
</template>
