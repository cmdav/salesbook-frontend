<template>
    <DashboardLayout pageTitle="Settings Page">
        <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
            <Tab>
                <!-- <template #tab1> Subscribers </template> -->
                <template #tab1> Subsciption Plan </template>

                <!-- <template #view1>
                    <SubscribersPage />
                </template> -->
                <template #view1>
                    <SubscribersPlan />
                </template>
            </Tab>
        </div>
    </DashboardLayout>
</template>

<script setup>
import Tab from "@/components/UI/Tab/Tab.vue";
import SubscribersPage from "@/views/Dashboard/Subscription/SubscribersPage/ViewSubscriptionPage.vue";
import SubscribersPlan from "@/views/Dashboard/Subscription/SubscribersPlanPage/ViewSubscribersPlan.vue";
</script>
