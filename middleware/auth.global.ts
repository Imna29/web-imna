export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.meta.skipAuth) {
        return true;
    }
    const user = await getCurrentUser();

    // redirect the user to the login page
    if (!user && to.name !== "login" && to.name !== "register") {
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }

    if (user && (to.name === "login" || to.name === "register")) {
        return abortNavigation("You are already logged in");
    }

    if (to.name !== "login" && to.name !== "register") {
        const idToken = await user.getIdToken();

        useFetch(`/api/user`, {
            method: "GET",
            headers: {
                "authorization": idToken
            },
            onResponse({request, response, options}) {
                if (response.status == 404 && to.name !== "register") {
                    navigateTo("/register/username")
                }


                if (response.status != 404) {
                    //TODO: Better server error handling
                    if (to.name == "register" || to.name == "register-username" || response.status == 500) {
                        navigateTo("/");
                    }
                }
            }
        });
    }
})