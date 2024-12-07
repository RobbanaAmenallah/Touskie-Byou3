import React from "react";

function FilterMenuLeft({ selectedCategory, onCategoryChange, categories }) {
  const handleCategoryChange = (event) => {
    onCategoryChange(event.target.value);
  };

  return (
    <div className="filter-menu">
      <h4>Filter by Category</h4>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="form-select"
        aria-label="Select category"
      >
        {/* Ajout d'un "option" vide pour permettre une option par défaut */}
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {/* Vérification et affichage de l'image */}
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
            ) : (
              <span>No Image</span> // Si pas d'image, afficher un message de secours
            )}
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterMenuLeft;
