<template>
  <div id="app">
    <header>
      <img src="/images/logo-les-bonnes-pieces.png" alt="LOGO">
      <h1>Les Bonnes Pièces</h1>
    </header>
    <main>
      <section class="filtres">
        <h3>Filtres</h3>
        <div id="filter-select">
          <label for="txt">Entrez le nom du produit</label>
          <input type="text" v-model="txt">
          <label for="dp">Disponibilité</label>
          <select v-model="dp">
            <option value="true" selected disabled> -- Choisir Disponibilité --</option>
            <option value="true">Oui</option>
            <option value="false">non</option>
          </select>
          <label for="filter">Filtrer par</label>
          <select v-model="filter">
            <option value="" selected disabled>-- Choisir un filtre --</option>
            <option value="id">ID</option>
            <option value="nom">Nom</option>
            <option value="prix">Prix</option>
            <option value="categorie">Catégorie</option>

          </select>
          <select v-show="filter" v-model="small">

            <option value="" selected disabled>-- Filtrer selon --</option>
            <option v-for="item in filteredItems" :value="item[filter]" :key="item[filter]">
              {{ item[filter] }}
            </option>
          </select>
          <select v-model="tri" v-show="filter && small">

            <option value="" selected disabled>-- Trier prix --</option>
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </section>

      <section class="fiches">
        <div v-for="piece in filteredPieces" :key="piece.id" class="fiche">
          <div class="dis">
            <p>ID: {{ piece.id }}</p>
            <p>Nom: {{ piece.nom }}</p>
            <p>Prix: {{ piece.prix + '€' }}</p>
            <p>Catégorie: {{ piece.categorie }}</p>
            <p>Disponibilité: {{ (piece.dispo ? 'Oui' : 'Non') }}</p>
            <button @click="panier.push(piece)" v-show="piece.dispo">Ajouter au panier</button>
          </div>
          <div class="ich">
            <img :src="piece.img" :alt="'Image de ' + piece.nom">
          </div>

        </div>
      </section>
      <section class="panier">
        <input type="checkbox" v-model="sp"> Afficher panier
        <div id="panier" v-show="sp">
          <div v-for="piece in panier" :key="piece.id">
            {{ piece.nom }}
          <button @click="panier.splice(panier.indexOf(piece), 1)">Supprimer</button>
        </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      txt: "",
      dp: "true",
      filter: "",
      small: "",
      tri: "",
      panier: [],
      sp: false,
      pieces: []
    }
  },

  computed: {
    filteredItems() {
      return [...new Set(this.pieces.map(piece => piece[this.filter]))]
        .map(value => ({ [this.filter]: value }));
    },
    filteredPieces() {
      let filtered = this.pieces;

      if (this.txt !== "") {
        filtered = filtered.filter(piece => piece.nom.toLowerCase().includes(this.txt.toLowerCase()));
      }

      if (this.dp === "true") {
        filtered = filtered.filter(piece => piece.dispo);
      } else {
        filtered = filtered.filter(piece => !piece.dispo);
      }

      if (this.filter && this.small) {
        filtered = filtered.filter(piece => piece[this.filter] === this.small);
      }

      if (!this.tri) {
        return filtered;
      }

      return filtered.sort((a, b) => {

        if (this.tri === "asc") return a.prix - b.prix;
        if (this.tri === "desc") return b.prix - a.prix;
        return 0;
      });
    }
  },

  mounted() {
    fetch('http://localhost:3000/pieces')
      .then(response => response.json())
      .then(data => this.pieces = data)
      .catch(console.error);
  }
}
</script>

<style>
@import './assets/styles.css';
</style>
