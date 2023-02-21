<template>
    <v-main class="secondary">
        <v-app-bar class="d-flex justify-center primary">
            <h1 class="amber--text text--lighten-4 my-6">Créer un admin</h1>
        </v-app-bar>
        <v-container>
            <!-- form -->
            <div class="d-flex justify-center">
                <v-form ref="form" v-model="valid" lazy-validation>
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
                        label="Créer votre mot de passe"
                        required
                    ></v-text-field>

                    <v-text-field
                        type="password"
                        v-model="verify"
                        :rules="verifyRule"
                        label="Confirmer votre mot de passe"
                        required
                    ></v-text-field>

                    <v-btn
                        :loading="checkLoading"
                        :disabled="!valid"
                        color="success"
                        class="mr-4 mt-4"
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
                                Votre compte a bien été créé!
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
                                La création de votre compte a échoué. Veuillez
                                réessayer
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="errorDialogue = false"
                                >
                                    Ok
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-btn color="error" class="mr-4 mt-4" @click="reset">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>

                    <v-dialog
                        v-model="leavingDialogue"
                        persistent
                        max-width="600"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="info mt-4" v-bind="attrs" v-on="on">
                                <v-icon>mdi-arrow-u-left-bottom</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="text-h5 info">
                                Etes-vous sûr de vouloir quitter?
                            </v-card-title>
                            <v-card-text
                                >Une fois avoir quitté, vous ne pourrez plus
                                retourner en arrière.</v-card-text
                            >
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="error darken-1"
                                    text
                                    @click="leavingDialogue = false"
                                >
                                    Non
                                </v-btn>
                                <v-btn
                                    color="success darken-1"
                                    text
                                    @click="goHome"
                                >
                                    Oui
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-form>
            </div>
        </v-container>
    </v-main>
</template>

<script>
import UserService from "../services/UserService";
export default {
    data: () => ({
        leavingDialogue: false,
        successDialogue: false,
        errorDialogue: false,
        nickname: "",
        password: "",
        verify: "",
        valid: true,
        nameRule: [(v) => !!v || "Ce champ est requis"],
        passwordRule: [(v) => !!v || "Ce champ est requis"],
        checkLoading: false,
    }),

    methods: {
        validate() {
            this.$refs.form.validate();
            if (this.$refs.form.validate()) {
                this.checkLoading = true;
                var data = {
                    nickname: this.nickname,
                    password: this.password,
                };
                UserService.register(data)
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
        reset() {
            this.$refs.form.reset();
        },
        goHome() {
            this.$router.push("/home");
        },
    },

    computed: {
        verifyRule() {
            const rules = [
                this.password === this.verify || "Password must match.",
            ];
            return rules;
        },
    },
};
</script>
