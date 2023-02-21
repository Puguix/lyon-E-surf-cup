<template>
    <v-main class="secondary">
        <v-app-bar class="d-flex justify-center primary">
            <h1 class="amber--text text--lighten-4">Créer un surfer</h1>
        </v-app-bar>
        <EditSurfer :surfer="newSurfer" />
    </v-main>
</template>

<script>
import EditSurfer from "../components-admin/editSurfer.vue";
export default {
    components: {
        EditSurfer,
    },
    data: () => ({
        newSurfer: {
            nationality: "",
            firstName: "",
            lastName: "",
            age: "",
            link: "",
            isLive: false,
            avatar: null,
            description: "",
        },
    }),
};
</script>
