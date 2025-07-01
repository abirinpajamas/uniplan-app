import React from "react";
import styled from "styled-components";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const FooterContainer = styled.footer`
  background-color: #222; /* Dark background */
  color: #eee; /* Light text */
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  line-height: 1;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    padding: 4px 20px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    align-items: flex-start;
  }
`;

const FooterHeader = styled.h6`
  color: #ccc;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    align-items: flex-start;
  }
`;

const LinkItem = styled.li`
  margin-bottom: 4px;

  a {
    color: #eee;
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: rgb(76, 10, 138); /* Accent color on hover */
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  font-size: 1.2rem;

  a {
    color: #eee;
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: rgb(76, 10, 138); /* Accent color on hover */
    }
  }
`;

const Copyright = styled.p`
  margin-top: 5px;
  text-align: center;
  color: #777;

  @media (min-width: 768px) {
    margin-top: 0;
    text-align: left;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterSection>
        <FooterHeader>Developed By</FooterHeader>
        <p>Abir Hasan & Sadman Arnob</p>
        <p>Dhaka, Bangladesh</p>
      </FooterSection>

      <FooterSection>
        <FooterHeader>Quick Links</FooterHeader>
        <LinkList>
          <LinkItem>
            <a href="/about">About Us</a>
          </LinkItem>
          <LinkItem>
            <a href="mailto:abir.5046@gmail.com">Contact</a>
          </LinkItem>
          <LinkItem>
            <a href="/privacy">Privacy Policy</a>
          </LinkItem>
        </LinkList>
      </FooterSection>

      {/*<FooterSection>
        <FooterHeader>Contact Us</FooterHeader>
        <p>Email: abir.5046@gmail.com</p>
      </FooterSection> */}

      <FooterSection>
        <FooterHeader>Follow Us</FooterHeader>
        <SocialIcons>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a href="mailto:your.email@example.com">
            <FaEnvelope />
          </a>
        </SocialIcons>
      </FooterSection>

      <Copyright>
        &copy; {new Date().getFullYear()} UniPlan. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
