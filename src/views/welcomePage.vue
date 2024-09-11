<template>
  <DashboardLayout>
    <section>
        <div class="cap">
            <div class="cap_img">
                <img src="../assets/iSalesbook-Option-02.png" alt="salesbook logo">
            </div>
            <h3 class="cap_text">Welcome to iSalesbook...</h3>
        </div>
    </section>
  </DashboardLayout>
</template>


<script setup>
// import { onMounted, ref, watch } from 'vue';
</script>

<style scoped>
.cap{
    /* border: red 2px dashed; */
    margin: 5em auto;
    width: fit-content;
    padding: 3em 0;
}
.cap_img img{
    width: 30rem;
}
.cap_text{
    padding-top: 3em;
    text-align: center;
    font-size: 2em;
    font-style: italic;
}
</style>
