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
                <v-icon @click="search = ''">mdi-close</v-icon>
            </v-toolbar>

            <v-navigation-drawer
                permanent
                right
                fixed
                floating
                mini-variant
                height="auto"
                class="d-none d-md-block mr-2 mt-16"
                color="transparent"
            >
                <v-tooltip left color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/"
                            icon
                            class="white--text black mx-4 my-4"
                            target="_blank"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-home</v-icon>
                        </v-btn>
                    </template>
                    <span>Allez à l'accueil</span>
                </v-tooltip>
                <v-tooltip left color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/create"
                            icon
                            class="white--text black mx-4 my-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon rounded>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Créer un surfer</span>
                </v-tooltip>
                <v-tooltip left color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/register"
                            icon
                            class="white--text black mx-4 my-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-account-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Ajouter un admin</span>
                </v-tooltip>
            </v-navigation-drawer>

            <v-row class="pt-6 mt-6">
                <v-col
                    v-for="surfer in displayedSurfers"
                    :key="surfer.lastName"
                    cols="12"
                    md="6"
                    lg="4"
                >
                    <v-card class="secondary mb-6 mx-6"
                        ><v-card-title class="justify-center pb-0">
                            <v-avatar height="150" width="150" class="ma-6">
                                <v-img :src="surfer.avatar"
                            /></v-avatar>
                        </v-card-title>
                        <v-card-title class="justify-center pt-0 text-no-wrap">
                            <h1>
                                {{ surfer.firstName }} {{ surfer.lastName }}
                            </h1>
                        </v-card-title>
                        <v-card-subtitle class="black--text text-center">
                            <h3>{{ surfer.age }}</h3>
                            <h3>
                                <country-flag
                                    :country="surfer.nationality"
                                    size="big"
                                />
                                {{ getNationalityName(surfer.nationality) }}
                            </h3>
                            <h5>
                                <v-switch
                                    class="black--text"
                                    :input-value="surfer.isLive"
                                    :label="` ${printState(surfer)}`"
                                    color="green"
                                    hide-details
                                    @change="changeState(surfer)"
                                />
                            </h5>
                        </v-card-subtitle>
                        <v-card-text class="black--text">
                            {{
                                surfer.liveLink
                                    ? "Lien vers le stream : " + surfer.liveLink
                                    : "Lien vers le stream non renseigné"
                            }}
                        </v-card-text>
                        <v-card-text class="black--text">
                            {{
                                surfer.description
                                    ? "Description : " + surfer.description
                                    : "Pas de description"
                            }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-tooltip
                                bottom
                                color="warning"
                                content-class="black--text"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        class="mr-3"
                                        color="warning"
                                        @click="edit(surfer)"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon rounded>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Modifier le surfer</span>
                            </v-tooltip>
                            <v-tooltip
                                bottom
                                color="red"
                                content-class="black--text"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        class="ml-3"
                                        color="red"
                                        @click="openDialogue(surfer)"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon rounded>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>Supprimer le surfer</span>
                            </v-tooltip>
                            <v-dialog
                                v-model="eraseDialogue"
                                persistent
                                max-width="600"
                            >
                                <v-card>
                                    <v-card-title class="text-h5 error" light>
                                        Voulez-vous vraiment supprimer le
                                        surfer?
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="success darken-1"
                                            text
                                            @click="erase()"
                                        >
                                            Oui </v-btn
                                        ><v-btn
                                            color="error darken-1"
                                            text
                                            @click="goBack"
                                        >
                                            Non
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <v-bottom-navigation
                class="d-lg-none black justify-space-around"
                fixed
                app
            >
                <v-tooltip top color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/"
                            color="black"
                            class="white--text mx-4 my-4"
                            target="_blank"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon large>mdi-home</v-icon>
                        </v-btn>
                    </template>
                    <span>Allez à l'accueil</span>
                </v-tooltip>
                <v-tooltip top color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/create"
                            color="black"
                            light
                            class="mx-4 my-4 white--text"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon large>mdi-plus-circle</v-icon>
                        </v-btn>
                    </template>
                    <span>Créer un surfer</span>
                </v-tooltip>
                <v-tooltip top color="secondary" content-class="black--text">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            to="/register"
                            color="black"
                            light
                            class="mx-4 my-4 white--text"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon large>mdi-account-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Ajouter un admin</span>
                </v-tooltip>
            </v-bottom-navigation>
        </v-container>
    </v-main>
</template>

<script>
import SurferDataService from "../services/SurferDataService";
import countries from "../assets/country";
export default {
    data: () => ({
        valid: true,
        surfers: [],
        search: "",
        dialog: false,
        eraseDialogue: false,
        surfer: Object,
    }),
    computed: {
        displayedSurfers() {
            const sortedSurfers = this.surfers;
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
    },
    methods: {
        openDialogue(surfer) {
            this.surfer = surfer;
            this.eraseDialogue = true;
        },
        erase() {
            SurferDataService.delete(this.surfer.id).then(() => {
                SurferDataService.getAll()
                    .then((response) => {
                        this.surfer = Object;
                        this.surfers = response.data;
                        this.eraseDialogue = false;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            });
        },
        goBack() {
            this.eraseDialogue = false;
        },
        edit(surfer) {
            this.$router.push("/edit/" + surfer.id);
        },
        printState(surfer) {
            if (surfer.isLive) {
                return "En ligne";
            } else {
                return "Hors ligne";
            }
        },
        changeState(surfer) {
            if (surfer.isLive) {
                surfer.isLive = false;
            } else {
                surfer.isLive = true;
            }

            var data = {
                firstName: surfer.firstName,
                lastName: surfer.lastName,
                age: surfer.age,
                nationality: surfer.nationality,
                isLive: surfer.isLive,
                liveLink: surfer.link,
            };
            SurferDataService.update(surfer.id, data);
        },
        getNationalityName(iso) {
            return countries.getName(iso, "fr");
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
    },
    created() {
        this.getAllSurfers();
    },
};
</script>
