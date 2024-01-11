class BranchifyJS {
    constructor(containerId, treeData) {
      this.container = document.getElementById(containerId);
      this.treeData = treeData;
      this.createTree();
    }

    createTreeNode(parent, data) {
      const node = document.createElement('li');
      node.classList.add('branchify-node');

      const switcher = document.createElement('span');
      switcher.classList.add('branchify-switcher');
      switcher.innerHTML = `
        <svg class="closed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
        <svg class="open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      `;
      switcher.addEventListener('click', () => this.toggleNode(node));
      node.appendChild(switcher);

      const checkbox = document.createElement('span');
      checkbox.classList.add('branchify-checkbox');
      checkbox.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
      </svg>
      `;
      checkbox.addEventListener('click', (event) => this.toggleCheckbox(event, data));
      node.appendChild(checkbox);

      const label = document.createElement('span');
      label.classList.add('branchify-label');
      label.textContent = data.label;
      label.addEventListener('click', () => this.toggleNode(node));
      node.appendChild(label);

      if (data.children) {
        const nodesContainer = document.createElement('ul');
        nodesContainer.classList.add('branchify-nodes');
        data.children.forEach(child => this.createTreeNode(nodesContainer, child));
        node.appendChild(nodesContainer);
      }

      parent.appendChild(node);
    }

    toggleNode(node) {
      node.classList.toggle('branchify-node__open');
    }

    toggleCheckbox(event, data) {
      event.stopPropagation();
      const checkbox = event.target.closest('.branchify-checkbox');
      checkbox.classList.toggle('branchify-checkbox-checked');
      this.updateChildCheckboxes(checkbox.closest('.branchify-node'));
      this.updateParentCheckboxes(checkbox.closest('.branchify-node'), data);
    }

    updateChildCheckboxes(node) {
      const childCheckboxes = node.querySelectorAll('.branchify-checkbox');
      const isChecked = node.querySelector('.branchify-checkbox').classList.contains('branchify-checkbox-checked');

      childCheckboxes.forEach(childCheckbox => {
        if (isChecked) {
          childCheckbox.classList.add('branchify-checkbox-checked');
        } else {
          childCheckbox.classList.remove('branchify-checkbox-checked');
        }
      });

      const childNodes = node.querySelectorAll('.branchify-node');
      childNodes.forEach(childNode => this.updateChildCheckboxes(childNode));
    }

    updateParentCheckboxes(node, data) {
      const parentCheckbox = node.closest('.branchify-node').querySelector('.branchify-checkbox');
      if (!parentCheckbox) return;

      const siblingCheckboxes = node.closest('.branchify-nodes').querySelectorAll('.branchify-checkbox');
      const allChecked = Array.from(siblingCheckboxes).every(checkbox => checkbox.classList.contains('branchify-checkbox-checked'));
      const someChecked = Array.from(siblingCheckboxes).some(checkbox => checkbox.classList.contains('branchify-checkbox-checked'));

      if (allChecked) {
        parentCheckbox.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
          </svg>
        `;
      } else if (someChecked) {
        parentCheckbox.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
          </svg>
        `;
      } else {
        parentCheckbox.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
          </svg>
        `;
      }

      this.updateParentCheckboxes(node.closest('.branchify-node'), data);
    }

    createTree() {
      this.createTreeNode(this.container, { label: 'Root', children: this.treeData });
    }
  }

  // Example usage
  const treeData = [
    { label: 'Category 1', children: [
      { label: 'Item 1.1' },
      { label: 'Item 1.2' },
      { label: 'Item 1.3' }
    ]},
    { label: 'Category 2', children: [
      { label: 'Item 2.1' },
      { label: 'Item 2.2' },
      { label: 'Item 2.3' }
    ]},
    { label: 'Category 3', children: [
      { label: 'Item 3.1' },
      { label: 'Item 3.2' },
      { label: 'Item 3.3' }
    ]}
  ];

  const branchifyInstance = new BranchifyJS('branchify', treeData);