<template>
    <v-card class="secondary mb-6 mx-6">
        <v-card-title class="justify-center pb-0">
            <v-avatar height="150" width="150" class="ma-6">
                <v-img :src="surfer.avatar"
            /></v-avatar>
        </v-card-title>
        <v-card-title class="justify-center pt-0 text-no-wrap">
            <h1>{{ surfer.firstName }} {{ surfer.lastName }}</h1>
        </v-card-title>
        <v-card-subtitle class="black--text text-center">
            <h3>{{ surfer.age }}</h3>
            <h3>
                <country-flag :country="surfer.nationality" size="big" />
                {{ getNationalityName(surfer.nationality) }}
            </h3>
            <h5 :class="(surfer.isLive ? 'success' : 'error') + '--text'">
                {{ surfer.isLive ? "En ligne" : "Hors ligne" }}
            </h5>
        </v-card-subtitle>
        <v-card-text v-if="printDescription" class="black--text">
            {{ surfer.description }}</v-card-text
        >
        <v-card-actions>
            <v-tooltip bottom color="primary" open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        block
                        :disabled="!surfer.description"
                        @click="displayDescription"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>{{ descriptionIcon }}</v-icon>
                    </v-btn>
                </template>
                <span>{{
                    descriptionIcon == "mdi-plus"
                        ? "Voir la description"
                        : "Cacher la description"
                }}</span>
            </v-tooltip>
        </v-card-actions>
        <v-card-actions>
            <v-dialog>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-on="on"
                        v-bind="attrs"
                        block
                        :disabled="!(surfer.liveLink && surfer.isLive)"
                    >
                        <v-icon>mdi-video</v-icon>
                    </v-btn>
                </template>
                <video-embed
                    css="embed-responsive-16by9"
                    :params="{ autoplay: 1 }"
                    v-if="surfer.isLive && surfer.liveLink"
                    :src="surfer.liveLink"
                ></video-embed>
            </v-dialog>
        </v-card-actions>
    </v-card>
</template>

<script>
import countries from "../assets/country";
export default {
    data: () => ({
        printDescription: false,
        descriptionIcon: "mdi-plus",
    }),
    props: {
        surfer: {
            required: true,
            type: Object,
        },
    },
    methods: {
        getNationalityName(iso) {
            return countries.getName(iso, "fr");
        },
        displayDescription() {
            if (!this.printDescription) {
                this.printDescription = true;
                this.descriptionIcon = "mdi-minus";
            } else {
                this.printDescription = false;
                this.descriptionIcon = "mdi-plus";
            }
        },
    },
};
</script>
