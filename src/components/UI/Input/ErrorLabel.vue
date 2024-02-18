<template>
  <div class="flex items-center">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_676_175814)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.0002 8.25002C12.4144 8.25002 12.7502 8.5858 12.7502 9.00002V13.5C12.7502 13.9142 12.4144 14.25 12.0002 14.25C11.586 14.25 11.2502 13.9142 11.2502 13.5V9.00002C11.2502 8.5858 11.586 8.25002 12.0002 8.25002Z"
          fill="currentColor"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.0054 4.45202C10.8466 2.83972 13.1538 2.83972 13.995 4.45202L20.5205 16.9592C21.3021 18.4572 20.2153 20.25 18.5257 20.25H5.47472C3.78512 20.25 2.69835 18.4572 3.4799 16.9592L10.0054 4.45202ZM12.6652 5.14587C12.3848 4.60844 11.6157 4.60844 11.3353 5.14587L4.80978 17.6531C4.54926 18.1524 4.91152 18.75 5.47472 18.75H18.5257C19.0889 18.75 19.4512 18.1524 19.1907 17.6531L12.6652 5.14587Z"
          fill="currentColor"
        ></path>
        <path
          d="M12.0002 17.25C12.6215 17.25 13.1252 16.7463 13.1252 16.125C13.1252 15.5037 12.6215 15 12.0002 15C11.3789 15 10.8752 15.5037 10.8752 16.125C10.8752 16.7463 11.3789 17.25 12.0002 17.25Z"
          fill="currentColor"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_676_175814">
          <rect width="18" height="18" fill="white" transform="translate(3 3)"></rect>
        </clipPath>
      </defs>
    </svg>
    <label v-bind="$attrs" class="font-Satoshi500 text-[15.606px]">
      <slot />
    </label>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
