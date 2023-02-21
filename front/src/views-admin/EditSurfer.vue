<template>
    <v-main class="secondary">
        <v-app-bar class="d-flex justify-center primary">
            <h1 class="amber--text text--lighten-4">Éditer un surfer</h1>
        </v-app-bar>
        <EditSurfer v-if="surfer" :surfer="surfer" />
    </v-main>
</template>

<script>
import EditSurfer from "../components-admin/editSurfer.vue";
import SurferDataService from "../services/SurferDataService";
export default {
    components: {
        EditSurfer,
    },
    data: () => ({
        surfer: null,
    }),
    created() {
        SurferDataService.get(this.$route.params.id).then((response) => {
            this.surfer = response.data;
        });
    },
};
</script>
