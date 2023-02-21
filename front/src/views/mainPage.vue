<template>
    <v-main class="primary">
        <v-container>
            <v-toolbar class="secondary mt-6">
                <v-text-field
                    hide-details
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    single-line
                ></v-text-field>
                <v-icon @click="reset">mdi-close</v-icon>
                <v-tooltip bottom color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            @click="dialogue = true"
                            icon
                            class="white--text black mx-4 my-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-image-multiple</v-icon>
                        </v-btn>
                    </template>
                    <span>Mur vidéo</span>
                </v-tooltip>
            </v-toolbar>

            <v-dialog v-model="dialogue" max-width="600">
                <v-list two-line class="secondary">
                    <v-subheader>
                        <h3>Surfers live</h3>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="showStreams(selectedSurfers)"
                            icon
                            class="white--text black mx-4 my-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-check</v-icon>
                        </v-btn></v-subheader
                    >

                    <v-alert
                        v-model="warning"
                        dense
                        dismissible
                        type="info"
                        color="primary"
                    >
                        Tu ne peux afficher que
                        {{ getMax(this.$vuetify.breakpoint.name) }} stream
                        différents
                    </v-alert>
                    <v-divider></v-divider>
                    <v-list-item-group
                        active-class="green--text"
                        multiple
                        :max="getMax(this.$vuetify.breakpoint.name)"
                    >
                        <v-list-item
                            v-for="surfer in liveSurfers"
                            :key="surfer.lastName"
                            @click="display(surfer)"
                        >
                            <template v-slot:default="{ active }">
                                <v-list-item-avatar>
                                    <v-img :src="surfer.avatar"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title
                                        v-text="surfer.firstName"
                                    ></v-list-item-title>

                                    <v-list-item-subtitle
                                        class="text--primary"
                                        v-text="surfer.lastName"
                                    ></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-icon
                                        v-if="!active"
                                        color="grey lighten-1"
                                    >
                                        mdi-eye-outline
                                    </v-icon>

                                    <v-icon v-else color="green darken-3">
                                        mdi-eye
                                    </v-icon>
                                </v-list-item-action>
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-dialog>
            <v-row class="pt-6 mt-6">
                <v-col
                    v-for="surfer in displayedSurfers"
                    :key="surfer.lastName"
                    cols="12"
                    md="6"
                    lg="4"
                >
                    <SurferCard :surfer="surfer" />
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import SurferDataService from "../services/SurferDataService";
import countries from "../assets/country";
import SurferCard from "../components/surferCard.vue";

export default {
    data: () => ({
        adminButton: false,
        surfers: [],
        search: "",
        dialogue: false,
        columnSize: 6,
        warning: false,
        selectedSurfers: [],
    }),
    components: { SurferCard },
    methods: {
        getNationalityName(iso) {
            return countries.getName(iso, "fr");
        },
        goToSurfer(surfer) {
            this.$router.push("/surfer/" + surfer.id);
        },
        goToWall() {
            this.$router.push("/steams");
        },
        reset() {
            this.search = "";
            SurferDataService.getAll()
                .then((response) => {
                    this.surfers = response.data;
                    this.surfers.sort((a, b) =>
                        a.isLive && !b.isLive ? -1 : 1
                    );
                    console.log(this.surfers);
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        async getAllSurfers() {
            await SurferDataService.getAll()
                .then((response) => {
                    this.surfers.push(...response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        getMax(size) {
            switch (size) {
                case "xs":
                    return 1;
                case "sm":
                    return 1;
                case "md":
                    return 4;
                default:
                    return 6;
            }
        },
        display(surfer) {
            if (this.selectedSurfers.includes(surfer)) {
                var surferIndex = this.selectedSurfers.indexOf(surfer);
                this.selectedSurfers.splice(surferIndex, 1);
            } else {
                if (
                    this.selectedSurfers.length ===
                    this.getMax(this.$vuetify.breakpoint.name)
                ) {
                    this.warning = true;
                } else {
                    this.selectedSurfers.push(surfer);
                }
            }
        },
        showStreams(surfers) {
            var link = "/streams/";
            surfers.forEach(function (surfer) {
                link = link + "$" + surfer.id;
            });
            this.$router.push(link);
        },
    },
    computed: {
        displayedSurfers() {
            const sortedSurfers = this.surfers
                .slice()
                .sort((a, b) => (a.isLive && !b.isLive ? -1 : 1));
            if (this.search) {
                return sortedSurfers.filter(
                    (surfer) =>
                        surfer.firstName
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) ||
                        surfer.lastName
                            .toLowerCase()
                            .includes(this.search.toLowerCase())
                );
            } else {
                return sortedSurfers;
            }
        },
        liveSurfers() {
            return this.surfers.filter(
                (surfer) => surfer.isLive && surfer.liveLink
            );
        },
    },

    mounted() {
        if (!this.currentUser || this.currentUser.roles === "admin") {
            this.adminButton = true;
        }
    },

    created() {
        this.getAllSurfers();
    },
};
</script>
