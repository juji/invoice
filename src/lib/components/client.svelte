<script lang="ts">

  const {
    title,
    clientName,
    clientAddress,
    clientPerson,
    clientPersonEmail,
  }:{
    title: string
    clientName: string
    clientAddress: string
    clientPerson: string
    clientPersonEmail: string
  } = $props()

  const addressMultiline = clientAddress.split('\n')

</script>

<div class="client">
  <p class="address-title">This {title.toLowerCase()} is addresed to:</p>
  <p class="entities"><b>{clientName}</b></p>
  <address>
    {#each addressMultiline as line}
      <p>{line}</p>
    {/each}
  </address>
  <p class="entities"><small>{clientPerson}</small></p>
  <p class="entities"><small>
    <a target="_blank" href={`mailto:${clientPersonEmail}`}>
      {clientPersonEmail}</a>
    </small></p>
</div>



<style>
  .client{

    .address-title{
      font-size: 0.9rem;
      margin-top: 0;
    }

    .entities{
      margin: 3px 0px;
    }

    address{
      margin: 8px 0;
      font-size: 0.8rem;
      p {
        margin: 3px 0;
      }
    }

  }
</style>