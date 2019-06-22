import { auth, firebase, db } from '../plugins/firebase';
import { api, generalCatch } from './index'

export default {
    methods: {
        returnUser: function(user) {
            if (!user || !user.uid) return {};
            return {
                id: user.uid,
                email: user.email,
                phone: user.phoneNumber,
                avatar: user.photoURL || 'https://png.pngtree.com/element_origin_min_pic/17/09/18/01bcc6c4cb661c2da2febbb8234e09bd.jpg',
                email: user.email,
                emailVerified: user.emailVerified,
                fullName: user.displayName,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
            }
        },
        signin: function(email, password) {
            return new Promise((resolve, reject) => {
                return auth.signInWithEmailAndPassword(email, password)
                    .then(
                        user => {
                            const currentUser = this.returnUser(user.user);
                            this.$store.commit('updateUser', currentUser);
                            resolve(currentUser);
                        }
                    ).catch(error => generalCatch(error, reject));
            });
        },
        signup: function(email, password) {
            return new Promise((resolve, reject) => {
                return auth.createUserWithEmailAndPassword(email, password)
                    .then(
                        user => {
                            const currentUser = this.returnUser(user.user);
                            this.$store.commit('updateUser', currentUser);
                            resolve(currentUser);
                        }
                    ).catch(error => generalCatch(error, reject));
            });
        },
        logout: function() {
            auth.signOut()
                .then(() => {
                    window.location.href = '/';
                });
        },
        getUser: function(raw = false) {
            //console.log('user.js : getUser()')
            if (raw) return auth.currentUser;
            let currentUser = this.returnUser(auth.currentUser);
            this.$store.commit('updateUser', { payload: currentUser });
            api('user/metadata').then(metadata => {
                if (metadata) {
                    currentUser = Object.assign(currentUser, metadata);
                    this.$store.commit('updateUser', { payload: currentUser });
                   // console.log('updateUser',currentUser)
                }
                this.getUserPlan();
            });
            return currentUser;
        },
        getPlanDetail: async function(name) {
            return db.collection("plan").doc(name).get().then((doc) => {
                const data = doc.data();
                if (!data) return false;
                return data;
            });
        },
        getUserPlan: async function() {
            let plan = this.$store.state.userInfo.plan;
            if (plan.details) return plan.details;
            else if (plan.id || plan.name) {
                let details = await this.getPlanDetail(plan.id || plan.name);
                if (!details) details = await this.getPlanDetail('free');
                this.$store.commit('updateUser', { payload: { details: details }, field: "plan" });
                return details;
            }
        },
        createRecapcha: function(elementId, callback) {
            return new firebase.auth.RecaptchaVerifier(elementId, {
                'size': 'invisible',
                callback
            });
        },
        changePassword: function(oldPassword, newPassword) {
            let cred = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
            return auth.currentUser.reauthenticateWithCredential(cred).then(() => {
                return auth.currentUser.updatePassword(newPassword);
            }).catch(generalCatch);
        },
        sendEmailVerification: function(actionCodeSettings, success_msg, failed_msg) {
            auth.currentUser.sendEmailVerification(actionCodeSettings)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: success_msg
                    });
                })
                .catch((error) => {
                    this.$message({
                        type: 'error',
                        message: failed_msg
                    });
                });
        },
        async getToken() {
            return auth.currentUser ? auth.currentUser.getIdToken() : '';
        },
        changePhoneNumber(new_phone, prompt) {
            let verificationId = null;
            var provider = new firebase.auth.PhoneAuthProvider();
            return provider.verifyPhoneNumber(new_phone, window.recaptchaVerifier).then((veriId) => {
                verificationId = veriId;
                return prompt();
            }).then(({ value }) => {
                var credential = firebase.auth.PhoneAuthProvider.credential(verificationId, value);
                auth.currentUser.updatePhoneNumber(credential);
            });
        }
    }
}