<script setup lang="ts">
import { useForm, Form } from "vee-validate";
import { z } from "zod";

const errorRef = ref<string>("");
const authStore = useAuthStore();

const userSchema = z.object({
    username: z
        .string()
        .min(2, "Username is too short")
        .max(25, "Username is too long")
        .describe("Username"),
});


const { handleSubmit, errors, defineField } = useForm({
    validationSchema: toTypedSchema(userSchema),
}
);

const [username, usernameAttrs] = defineField("username");

const onRegisterSubmit = handleSubmit(async (values) => {
    errorRef.value = "";
    try {
        await authStore.registerWithUsername(values.username);
        navigateTo("/");
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


</script>

<template>
    <div class="mt-auto mb-auto mx-auto pb-10">
        <Card class="mx-auto max-w-sm">
            <template #title>Sign Up</template>
            <template #subtitle>
                Enter your username to create your account</template>
            <template #content>
                <Form @submit="onRegisterSubmit()">
                    <FloatLabel variant="in" class="w-full">
                        <InputText id="username" v-model="username" type="text" class="w-full"/>
                        <label for="username">Username</label>
                    </FloatLabel>

                    <div class="grid gap-2 mt-2">
                        <div class="text-sm text-destructive">
                            {{ errors.username }}
                            {{ errorRef }}
                        </div>
                        <Button type="submit" class="w-full">
                            Set Username
                        </Button>
                    </div>

                </Form>
            </template>

        </Card>
    </div>
</template>

<style scoped></style>
