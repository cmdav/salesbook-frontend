<template>
    <DashboardLayout pageTitle="Subscription Page">
        <div class="container p-0 lg:p-6 lg:py-3 py-4 mb-5">
            <Tab>
                <template #tab1> Subscribers </template>
                <template #tab2> Subsciption Plan </template>

                <template #view1>
                    <SubscribersPage />
                </template>
                <template #view2>
                    <SubscribersPlan />
                </template>
            </Tab>
        </div>
    </DashboardLayout>
</template>

<script setup>
import Tab from "@/components/UI/Tab/TabComponent.vue";
import SubscribersPage from "@/views/Dashboard/Subscriptions/SubscribersPage/ViewSubscriptionPage.vue";
import SubscribersPlan from "@/views/Dashboard/Subscriptions/SubscribersPlanPage/ViewSubscribersPlan.vue";
</script>
