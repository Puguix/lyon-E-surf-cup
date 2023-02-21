<template>
    <v-main class="secondary">
        <v-app-bar class="d-flex justify-center primary">
            <h1 class="amber--text text--lighten-4 my-6">Se connecter</h1>
        </v-app-bar>
        <v-container>
            <!-- form -->
            <div class="d-flex justify-center">
                <v-form ref="form" v-model="valid" lazy-validation class="mt-6">
                    <v-text-field
                        v-model="nickname"
                        :rules="nameRule"
                        label="Pseudo"
                        required
                    ></v-text-field>

                    <v-text-field
                        type="password"
                        v-model="password"
                        :rules="passwordRule"
                        label="Mot de passe"
                        required
                    ></v-text-field>

                    <v-btn
                        :loading="checkLoading"
                        :disabled="!valid"
                        color="success"
                        class="mr-4 mt-6"
                        @click="validate"
                        id="validate"
                    >
                        <v-icon>mdi-check</v-icon>
                    </v-btn>

                    <v-dialog
                        v-model="successDialogue"
                        persistent
                        max-width="600"
                    >
                        <v-card>
                            <v-card-title class="text-h5 success" light>
                                Vous êtes bien connecté!
                            </v-card-title>
                            <v-card-text>
                                Vous pouvez maintenant ajouter, modifier, et
                                supprimer les surfers de la compétition.
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="goHome"
                                >
                                    Aller à l'accueil
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog
                        v-model="errorDialogue"
                        persistent
                        max-width="600"
                    >
                        <v-card>
                            <v-card-title class="text-h5 error" light>
                                Un problème est survenu
                            </v-card-title>
                            <v-card-text>
                                Nous n'avons pas réussi à vous connecter.
                                Veuillez réessayer
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="error darken-1"
                                    text
                                    @click="errorDialogue = false"
                                >
                                    Ok
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-btn color="error" class="mr-4 mt-6" @click="reset">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>

                    <v-tooltip bottom color="info" open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="info"
                                class="mr-4 mt-6"
                                @click="reset"
                                to="/"
                                target="_blank"
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon>mdi-home</v-icon>
                            </v-btn>
                        </template>
                        <span>Aller à la page visiteur</span>
                    </v-tooltip>
                </v-form>
            </div>
        </v-container>
    </v-main>
</template>

<script>
import UserService from "../services/UserService";
export default {
    data: () => ({
        nickname: "",
        password: "",
        checkLoading: false,
        errorDialogue: false,
        successDialogue: false,
        valid: true,
        nameRule: [(v) => !!v || "Votre pseudo est requis"],
        passwordRule: [(v) => !!v || "Il faut votre mot de passe"],
    }),
    methods: {
        reset() {
            this.$refs.form.reset();
        },
        goHome() {
            this.$router.push("/home");
        },
        validate() {
            this.$refs.form.validate();
            if (this.$refs.form.validate()) {
                this.checkLoading = true;
                var data = {
                    nickname: this.nickname,
                    password: this.password,
                };
                UserService.login(data)
                    .then((response) => {
                        console.log(response.data);
                        this.checkLoading = false;
                        this.successDialogue = true;
                    })
                    .catch((e) => {
                        console.log(e);
                        this.checkLoading = false;
                        this.errorDialogue = true;
                    });
            }
        },
    },
};
</script>
