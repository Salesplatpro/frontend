// @ts-ignore
const devBaseUrl = 'http://localhost:3000/'

describe('auxhr landing page', () => {
  it('should visit the base url', () => {
    cy.visit(devBaseUrl)

    cy.get('[data-testId="major-title"]')
      .should('exist')
      .should('have.text', 'Hire the best talents for your organization')
  })
})

describe('renders navbar', () => {
  beforeEach(() => {
    cy.visit(devBaseUrl)
  })

  it('renders the navbar', () => {
    cy.get('a[href="/"]').should('exist')
    cy.get('[data-testId="navbar"]').should('exist')
  })

  it('should render the navbar with all navigation links', () => {
    const navbarLinks = [
      {
        href: 'a[href="/solution"',
        value: 'solution',
        include: 'All you need to find the best talents',
      },
      {
        href: 'a[href="/resources"]',
        value: 'resources',
        include: 'Business Resources',
      },
      {
        href: 'a[href="/explore"]',
        value: 'explore',
        include: 'Find the best jobs...',
      },
      {
        href: 'a[href="/customerstories"]',
        value: '',
        include: 'Wanaka, New Zealand',
      },
    ]

    navbarLinks.map(({ href, value, include }) => {
      cy.get(href).should('contain.text', value).click({ multiple: true })
      cy.url()
        .should('include', `/${value}`)
        .get('[data-testId="heading"]')
        .should('have.text', include)
    })
  })

  it('should have the three buttons (Login, Apply for Jobs, Hire Talents)', () => {
    const buttons = [
      {
        class: 'login',
        link: '/login',
        text: 'Login',
        pageText: 'Login your account',
      },
      {
        class: 'apply',
        link: '/talentRegister',
        text: 'Apply for jobs',
        pageText: 'Create account',
      },
      {
        class: 'hire',
        link: '/recruiterRegister',
        text: 'Hire Talents',
        pageText: 'Create account',
      },
    ]

    buttons.forEach(({ class: className, link, text, pageText }) => {
      it(`should have the ${text} button`, () => {
        cy.get(`button.${className}`)
          .should('exist')
          .within(() => {
            cy.get('a')
              .should('have.attr', 'href', link)
              .and('contain.text', text)
          })

        // Break the chain before clicking
        cy.get(`button.${className}`).click()

        cy.url().should('include', link)
        cy.contains(pageText).should('exist')
        cy.get('form').should('exist')
      })
    })
  })
})
