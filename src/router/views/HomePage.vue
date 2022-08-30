<template>
    <div class="flex flex-col items-center mt-36">
        <div class="flex items-center text-center justify-center relative  w-80 ">
            <input :class="harfSayisiInput" class="text-black my-10 pr-10 outline-dashed w-80 rounded-3xl px-5 py-2 transition-all" type="text" placeholder="asdf..." v-model="mesaj" @keyup="isTypingCheck" @keydown.enter="ekle" >
            <p class="absolute right-4 opacity-80 select-none" :class="harfSayisi">{{mesaj.length}}</p>
        </div>     
        <div id="listItems" class="h-36 overflow-y-scroll no-scrollbar scroll-smooth transition-all" :class="maddeSayisi">
            <ul class="list-disc list-outside ml-6">
            <li v-for="i in todos" :class="{'!bg-lime-600' : i.isOk}" :key="i.id" @dblclick="tamamla(i.id)" class="hover:bg-slate-700 rounded-xl  px-2 cursor-pointer text-left w-80 font-bold text-lg text-sky-400 transition-all italic"><button @click="sil(i.id)" class="bg-red-500 hover:bg-rose-800 hover:cursor-help transition-all px-1 my-1 rounded-full mr-4 text-white">X</button><span class=" text-white">{{ i.mesaj }}</span>  </li>
            </ul> 
            <ul class="list-disc list-outside ml-6">
            <li  v-show="isTyping" class=" text-left w-80 font-thin text-lg opacity-70 text-sky-900 italic"><span class="text-white ">{{mesaj}}</span></li>
            </ul>
        </div>
        <div v-show="maddeSayisiUcNokta" class="rotate-90 select-none text-center font-bold text-xl animate-pulse ">...</div>
    </div>



</template>

<script setup>
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import store from '../../store';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc ,query, orderBy } from "firebase/firestore";
import {db} from '../../firebase'
import { onMounted } from 'vue';



var mesaj = ref("")
var isTyping = ref(false)

const todos = ref ([])
/*TASARIMSAL METODLAR */

const maddeSayisi = computed(()=>{
    return mesajSayisi.value >= 5 ? "border-b-2" :"border-none"
})
const maddeSayisiUcNokta = computed(()=>{
    return mesajSayisi.value >= 5 ? true : false
})

const isTypingCheck = () =>{
    document.querySelector("#listItems").scrollTop=document.querySelector("#listItems").scrollHeight
    isTyping.value = mesaj.value != "" ? true : false
    harfSayisi
}

var harfSayisi = computed(()=>{
    return mesaj.value.length > 30 || mesaj.value.length < 3  ? "text-red-500" : "text-green-500"
})

var harfSayisiInput = computed(()=>{
    return mesaj.value.length > 30 || mesaj.value.length < 3 ? "outline-red-500 shadow-lg shadow-red-500" : "outline-green-500 shadow-lg shadow-green-500"
})



const listeSıralama = query(collection(db, "liste"), orderBy("date", "asc"));
/*FIREBASE ILE METODLAR */

const ekle =()=>{
    if(mesaj.value=="" || mesaj.value.length<3 || mesaj.value.length>30){
        mesaj.value = ""
    }
    else{
        addDoc(collection(db, "liste"), {
        mesaj:mesaj.value,
        isOk:false,
        date: Date.now()
        });
        mesaj.value=""
    }

}

const sil =(id)=>{
    deleteDoc(doc(collection(db, "liste"), id));
}

const tamamla=i=>{

     updateDoc(doc(collection(db, "liste"), i), {
        isOk: !todos.value.isOk
    });
}
var mesajSayisi = ref()
onMounted(async ()=>{

        onSnapshot(listeSıralama, (querySnapshot) => {
        const fbListe = [];
        querySnapshot.forEach((doc) => {
        const liste={
            id:doc.id,
            mesaj: doc.data().mesaj,
            isOk:doc.data().isOk
            }
            fbListe.push(liste)
        });
        todos.value = fbListe
        mesajSayisi.value=fbListe.length
    });
})


</script>


<style>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>