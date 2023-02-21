<template>
    <v-main class="secondary">
        <v-container>
            <v-card-title
                class="justify-center pa-0"
                v-if="editedSurfer.avatar"
            >
                <v-avatar height="150" width="150" class="ma-6">
                    <v-img :src="editedSurfer.avatar"
                /></v-avatar>
            </v-card-title>
            <!-- form -->
            <div class="d-flex justify-center">
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                        v-model="editedSurfer.firstName"
                        :rules="nameRule"
                        label="Prénom"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="editedSurfer.lastName"
                        :rules="nameRule"
                        label="Nom"
                        required
                    ></v-text-field>

                    <country-select
                        v-model="editedSurfer.nationality"
                        :country="editedSurfer.nationality"
                        :usei18n="true"
                    />

                    <v-text-field
                        v-model="editedSurfer.age"
                        :rules="nameRule"
                        label="Age"
                    ></v-text-field>

                    <v-file-input
                        accept="image/png, image/jpeg"
                        placeholder="Pick an avatar"
                        prepend-icon="mdi-camera"
                        :rules="sizeRule"
                        label="Avatar"
                        @change="handleFileUpload($event)"
                    ></v-file-input>

                    <div class="cropper-wrapper">
                        <cropper
                            v-if="editedSurfer.avatar"
                            stencil-component="circle-stencil"
                            :src="baseAvatar"
                            :canvas="{
                                maxHeight: MAX_IMAGE_SIZE,
                                maxWidth: MAX_IMAGE_SIZE,
                            }"
                            @change="crop"
                        />
                    </div>

                    <v-text-field
                        v-model="editedSurfer.link"
                        label="Lien vers le stream"
                    ></v-text-field>

                    <v-checkbox
                        v-model="editedSurfer.isLive"
                        label="Le surfer est en live"
                    ></v-checkbox>

                    <v-textarea
                        label="Description"
                        filled
                        auto-grow
                        v-model="editedSurfer.description"
                    ></v-textarea>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="!valid"
                            color="success"
                            class="mr-4"
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
                                    Le surfer est à jour!
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="green darken-1"
                                        text
                                        @click="goBack"
                                    >
                                        Ok
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
                                    Une erreur est survenue!
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="success" text @click="stay">
                                        Réessayer
                                    </v-btn>
                                    <v-btn color="error" text @click="goBack">
                                        Quitter
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-btn color="error" class="mr-4" @click="reset">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>

                        <v-dialog v-model="dialog" persistent max-width="600">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="info"
                                    v-bind="attrs"
                                    v-on="on"
                                    dark
                                >
                                    <v-icon>mdi-keyboard-backspace</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title class="text-h5 info lighten-2">
                                    Etes-vous sûr de vouloir quitter?
                                </v-card-title>
                                <v-card-text
                                    >Une fois avoir quitté, vous aurez perdu les
                                    données que vous venez
                                    d'entrer.</v-card-text
                                >
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="red darken-1"
                                        text
                                        @click="dialog = false"
                                    >
                                        Non
                                    </v-btn>
                                    <v-btn
                                        color="green darken-1"
                                        text
                                        @click="goBack"
                                    >
                                        Oui
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-form>
            </div>
        </v-container>
    </v-main>
</template>

<script>
import SurferDataService from "../services/SurferDataService";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const MAX_IMAGE_SIZE = 1080;

export default {
    components: {
        Cropper,
    },
    props: {
        surfer: {
            required: true,
            type: Object,
        },
    },
    data: () => ({
        dialog: false,
        successDialogue: false,
        errorDialogue: false,
        valid: true,
        nameRule: [(v) => !!v || "Ce champ est requis"],
        sizeRule: [
            (v) =>
                !v ||
                v.size < 6000000 ||
                "Avatar size should be less than 6 MB!",
        ],
        editedSurfer: null,
        MAX_IMAGE_SIZE,
    }),
    methods: {
        validate() {
            this.$refs.form.validate();
            console.log("etat du dialogue", this.successDialogue);
            if (this.$refs.form.validate()) {
                var data = {
                    firstName: this.editedSurfer.firstName,
                    lastName: this.editedSurfer.lastName,
                    age: this.editedSurfer.age,
                    nationality: this.editedSurfer.nationality,
                    isLive: this.editedSurfer.isLive,
                    liveLink: this.editedSurfer.link,
                    avatar: this.editedSurfer.avatar,
                    description: this.editedSurfer.description,
                };
                if (this.editedSurfer.id) {
                    SurferDataService.update(this.editedSurfer.id, data)
                        .then((response) => {
                            this.id = response.data.id;
                            console.log(response.data);
                            this.successDialogue = true;
                        })
                        .catch((e) => {
                            console.log(e);
                            this.errorDialogue = true;
                        });
                } else {
                    SurferDataService.create(data)
                        .then((response) => {
                            this.id = response.data.id;
                            console.log(response.data);
                            this.successDialogue = true;
                        })
                        .catch((e) => {
                            console.log(e);
                            this.errorDialogue = true;
                        });
                }
            }
        },
        reset() {
            this.$refs.form.reset();
        },
        goBack() {
            this.$router.push("/home");
        },
        stay() {
            this.errorDialogue = false;
        },
        handleFileUpload(file) {
            if (file instanceof File) {
                console.log("importing file:", file.size, file);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.editedSurfer.avatar = reader.result;
                    this.baseAvatar = reader.result;
                };
            } else {
                console.error("not a file:", file);
            }
        },
        async crop({ coordinates, canvas }) {
            console.log(coordinates, canvas);
            if (canvas.width > MAX_IMAGE_SIZE) {
                const ratio = MAX_IMAGE_SIZE / canvas.width;
                canvas.height *= ratio;
                canvas.width = MAX_IMAGE_SIZE;
            }
            if (canvas.height > MAX_IMAGE_SIZE) {
                const ratio = MAX_IMAGE_SIZE / canvas.height;
                canvas.width *= ratio;
                canvas.height = MAX_IMAGE_SIZE;
            }
            const image = canvas.toDataURL("image/jpeg", 0.7);
            if (this.editedSurfer.avatar != image) {
                this.editedSurfer.avatar = image;
            }
            console.log(this.editedSurfer.avatar);
        },
    },
    created() {
        this.editedSurfer = this.surfer;
        this.baseAvatar = this.editedSurfer.avatar;
    },
};
</script>

<style>
.cropper-wrapper {
    margin: auto;
    max-width: 80vw;
}
</style>
